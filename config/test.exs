use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :elixirmmo, ElixirmmoWeb.Endpoint,
  http: [port: 4001],
  server: false

# Configure your database
config :elixirmmo, Elixirmmo.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "elixirmmp_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox


# Print only warnings and errors during test
config :logger, level: :warn
