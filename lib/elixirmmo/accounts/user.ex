defmodule Elixirmmo.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset
  alias Elixirmmo.Accounts.User


  schema "users" do
    field :name, :string
    field :player_id, :string

    field :x, :integer, null: false
    field :y, :integer, null: false

    timestamps()
  end

  @doc false
  def changeset(%User{} = user, attrs) do
    user
    |> cast(attrs, [:name, :player_id, :x, :y])
    |> validate_required([:name, :player_id, :x, :y])
  end

  @doc false
  def update_changeset(%User{} = user, attrs) do
    user
    |> cast(attrs, [:name, :x, :y])
  end
end
