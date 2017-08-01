defmodule Elixirmmo.GameLogic do

  def init do
    %{}
  end

  def move(%{} = state, player, pos) do
    Map.put(state, player, Map.put(pos, :id, player))
  end
end
