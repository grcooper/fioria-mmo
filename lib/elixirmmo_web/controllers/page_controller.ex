defmodule ElixirmmoWeb.PageController do
  use ElixirmmoWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
