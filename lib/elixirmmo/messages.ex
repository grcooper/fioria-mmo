defmodule Elixirmmo.Messages do
  use Protobuf, from: Path.wildcard(Path.expand("../../priv/messages/**/*.proto", __DIR__)),
                use_package_names: true
end
