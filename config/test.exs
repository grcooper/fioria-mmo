use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :fioria, FioriaWeb.Endpoint,
  http: [port: 4001],
  server: false

# Configure your database
config :fioria, Fioria.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "fioria_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox


# Print only warnings and errors during test
config :logger, level: :warn
