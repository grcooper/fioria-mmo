# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :fioria,
  ecto_repos: [Fioria.Repo]

# Configures the endpoint
config :fioria, FioriaWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "Pr+iyHBy06Nu4eZuZSYqViCU5EBKqwZemwrlkZO0W6tMSaaJUbOq71HePqVji7qd",
  render_errors: [view: FioriaWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Fioria.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
