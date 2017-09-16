# Development

1. Clone the repo `git clone https://github.com/lego/fioria/`
2. Install Ellixir [here](https://elixir-lang.org/install.html)
3. Install NPM/NodeJS however you choose you can get downloads [here](https://nodejs.org/en/download/)
4. Install Postgres from [here](http://postgresguide.com/setup/install.html) and set password to `postgres` and username to `postgres` 
5. Install dependancies from the root folder with `mix deps.get`
6. Create the postgres database with `mix ecto.setup`
7. Install node dependencies with `cd assets && npm install`
8. Go back to the root directory `cd ..`
9. Start your server with `mix phx.server`
10. Run tests using `mix tests`

Make sure to check out our [deveopment plans](devplans.md) before contributing so your vision is in line with ours. Feel free to submit changes to the plans if you have a really cool idea you want to implement.

## Learn More about our tools

- Official website: [http://www.phoenixframework.org/](http://www.phoenixframework.org/)
- Guides: [http://phoenixframework.org/docs/overview](http://phoenixframework.org/docs/overview)
- Docs: [https://hexdocs.pm/phoenix](https://hexdocs.pm/phoenix)
- Mailing list: [http://groups.google.com/group/phoenix-talk](http://groups.google.com/group/phoenix-talk)
- Source: [https://github.com/phoenixframework/phoenix](https://github.com/phoenixframework/phoenix)
