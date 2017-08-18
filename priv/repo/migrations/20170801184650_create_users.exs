defmodule Fioria.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :name, :string
      add :player_id, :string
      add :x, :integer
      add :y, :integer

      timestamps()
    end

    create index(:users, [:player_id])
  end
end
