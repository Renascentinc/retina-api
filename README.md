# retina-api

This is an api that the repo ```Renascentinc/retina-app``` will call.

## To run the app locally

### On a Mac

1. Install postgresql with <br>
  ```sh
    brew install postgresql
  ```

2. Start/Stop postgresql server with
  ```sh
    brew services start postgresql #start always-running background process
    brew services stop postgresql #stop process
  ```
  Or, if you don't want a constantly running background process:
  ```sh
    pg_ctl -D /usr/local/var/postgres start
    pg_ctl -D /usr/local/var/postgres stop
  ```

3. Set version of node to 8.11.3. This is most easily done with the package [n](https://github.com/tj/n):
  ```sh
    npm install -g n
    n 8.11.3
  ```

4. Install node packages with `npm install`

5. Start app with `npm start`

## Contributing
If you add npm packages, make sure you use the --save flag, eg. `npm install <package_name> --save`
