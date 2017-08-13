defmodule ElixirmmoWeb.GameChannel do
  require Logger
  alias Elixirmmo.GameState
  use Phoenix.Channel
  alias Elixirmmo.Accounts

  def join("game", _params, socket) do
    player_id = socket.assigns.player_id
    players = GameState.get_players() |> Enum.map(fn {_, player} -> Map.put(player, :new, true) end)
    user = Accounts.get_user_by_player_id(player_id)
    player = GameState.move(player_id, %{x: user.x, y: user.y})
    Logger.info "Client joined: player_id=#{player_id} player.id=#{player.id} player=#{inspect player} user.x=#{user.x} user.y=#{user.y} user=#{inspect user}"
    send(self(), {:after_join, player_id})
    {:ok, %{players: players, player: player, token: player_id}, socket}
  end

  def terminate(_, socket) do
    player_id = socket.assigns.player_id
    player = GameState.get_player(player_id)
    Logger.info "Client websocket terminated: player_id=#{player_id} player.ix=#{player.id} player=#{inspect player}"
    user = Accounts.get_user_by_player_id(player_id)
    Accounts.update_user(user, %{
      x: player[:x],
      y: player[:y],
    })
    GameState.remove_player(player_id)
    broadcast! socket, "player:left", %{player_id: socket.assigns.player_id}
    {:shutdown, :left}
  end

  def handle_in("move", %{"x" => x, "y" => y}, socket) do
    player = GameState.move(socket.assigns.player_id, %{x: x, y: y})
    broadcast! socket, "player:position", %{player_info: player}
    {:noreply, socket}
  end

  def handle_in("move", "left", socket) do
    move_player(-3, 0, socket)
  end

  def handle_in("move", "right", socket) do
    move_player(3, 0, socket)
  end

  def handle_in("move", "up", socket) do
    move_player(0, -3, socket)
  end

  def handle_in("move", "down", socket) do
    move_player(0, 3, socket)
  end

  def move_player(x_delta, y_delta, socket) do
    player_id = socket.assigns.player_id
    %{x: x, y: y} = GameState.get_player(player_id)
    player = GameState.move(socket.assigns.player_id, %{x: x + x_delta, y: y + y_delta})
    broadcast! socket, "player:position", %{player_info: player}
    {:noreply, socket}
  end

  def handle_info({:after_join, player_id}, socket) do
    player = GameState.get_player(player_id) |> Map.put(:new, true)
    broadcast! socket, "player:joined", %{player_info: player}
   {:noreply, socket}
  end
end
