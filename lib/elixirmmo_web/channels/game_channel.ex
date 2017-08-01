defmodule ElixirmmoWeb.GameChannel do
  require Logger
  alias Elixirmmo.GameState
  use Phoenix.Channel

  def join("game", params, socket) do
    socket = assign(socket, :player_id, UUID.uuid4())
    Logger.info("Client joined: player_id=#{socket.assigns.player_id}")
    send(self(), {:after_join, params})
    players = GameState.get_players()
    players = Enum.map(players, fn {_, player} -> Map.put(player, :new, true) end)
    {:ok, %{players: players}, socket}
  end

  def terminate(_, socket) do
    Logger.info("Client websocket terminated: player_id=#{socket.assigns.player_id}")
    GameState.remove_player(socket.assigns.player_id)
    broadcast! socket, "player:left", %{player: socket.assigns.player_id}
    {:shutdown, :left}
  end

  def handle_in("heartbeat", params, socket) do
    GameState.move(socket.assigns.player_id, params)
    {:noreply, socket}
  end

  def handle_in("move", params, socket) do
    player = GameState.move(socket.assigns.player_id, params)
    broadcast! socket, "player:position", %{player: player}
    {:noreply, socket}
  end

  def handle_info({:after_join, params}, socket) do
    player = GameState.move(socket.assigns.player_id, params)
    player = Map.put(player, :new, true)
    broadcast! socket, "player:joined", %{player: player}
   {:noreply, socket}
  end

  def handle_info({:after_leave}, socket) do
    Logger.info("Boop boop #{socket.assigns.player_id}")
    GameState.remove_player(socket.assigns.player_id)
    broadcast! socket, "player:left", %{player: socket.assigns.player_id}
   {:noreply, socket}
  end
end
