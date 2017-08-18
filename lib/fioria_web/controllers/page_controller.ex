defmodule FioriaWeb.PageController do
  use FioriaWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
