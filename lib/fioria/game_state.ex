defmodule Fioria.GameState do
  alias Fioria.GameLogic
  use Agent

  @moduledoc """
  Manages the game's state by use of an Elixir Agent.
  """

  @doc """
  Starts a new game.
  """
  def start_link() do
    Agent.start_link(fn -> GameLogic.init() end, name: __MODULE__)
  end

  @doc """
  Executes a move for next player.
  """
  def move(player_id, pos) do
    Agent.update(__MODULE__, fn state -> GameLogic.move(state, player_id, pos) end)
    get_player(player_id)
  end

  def get_players() do
    Agent.get(__MODULE__, fn state -> state end)
  end

  def remove_player(player_id) do
    Agent.update(__MODULE__, fn state -> Map.delete(state, player_id) end)
  end

  def get_player(player_id) do
    Agent.get(__MODULE__, fn state -> state[player_id] end)
  end
end
