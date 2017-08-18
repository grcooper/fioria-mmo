defmodule FioriaWeb.Router do
  use FioriaWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    # plug :put_user_token
  end

  # defp put_user_token(conn, _) do
  #   if current_user = conn.assigns[:current_user] do
  #     token = Phoenix.Token.sign(conn, "user socket", current_user.id)
  #     assign(conn, :user_token, token)
  #   else
  #     conn
  #   end
  # end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", FioriaWeb do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", FioriaWeb do
  #   pipe_through :api
  # end
end
