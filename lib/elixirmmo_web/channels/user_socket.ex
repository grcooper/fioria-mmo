defmodule ElixirmmoWeb.UserSocket do
  alias Elixirmmo.Accounts.User
  alias Elixirmmo.Accounts
  use Phoenix.Socket
  require Logger
  require UUID

  ## Channels
  channel "game", ElixirmmoWeb.GameChannel

  ## Transports
  transport :websocket, Phoenix.Transports.WebSocket
  # transport :longpoll, Phoenix.Transports.LongPoll

  # Socket params are passed from the client and can
  # be used to verify and authenticate a user. After
  # verification, you can put default assigns into
  # the socket that will be set for all channels, ie
  #
  #     {:ok, assign(socket, :user_id, verified_user_id)}
  #
  # To deny connection, return `:error`.
  #
  # See `Phoenix.Token` documentation for examples in
  # performing token verification on connect.
  def connect(%{"token" => token}, socket) do
    Logger.info "Connection token=#{inspect token}"
    case Accounts.get_user_by_player_id(token) do
      %User{} = user ->
        {:ok, assign(socket, :player_id, user.player_id)}
      _ ->
        user = Accounts.create_user(%{player_id: UUID.uuid4(), x: 0, y: 0, name: "Jack"})
        {:ok, assign(socket, :player_id, user.player_id)}
    end
  end

  def connect(params, socket) do
    Logger.info "Connection params=#{inspect params}"
    # @FIXME: handle error on user creation
    {:ok, user} = Accounts.create_user(%{player_id: UUID.uuid4(), x: 0, y: 0, name: "Jack"})
    {:ok, assign(socket, :player_id, user.player_id)}
  end

  # Socket id's are topics that allow you to identify all sockets for a given user:
  #
  #     def id(socket), do: "user_socket:#{socket.assigns.user_id}"
  #
  # Would allow you to broadcast a "disconnect" event and terminate
  # all active sockets and channels for a given user:
  #
  #     ElixirmmoWeb.Endpoint.broadcast("user_socket:#{user.id}", "disconnect", %{})
  #
  # Returning `nil` makes this socket anonymous.
  def id(_socket), do: nil
end
