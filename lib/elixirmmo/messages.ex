defmodule Elixirmmo.Messages do
  @external_resource Path.wildcard(Path.expand("../../priv/messages/**/*.proto", __DIR__))
  use Protobuf, from: Path.wildcard(Path.expand("../../priv/messages/**/*.proto", __DIR__)),
                use_package_names: true
end
