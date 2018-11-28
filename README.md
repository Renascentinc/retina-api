# retina-api

This is an api that the repo ```Renascentinc/retina-app``` will call.

# GraphQL Development

GraphQl cheat sheet can be found [here](https://github.com/sogko/graphql-schema-language-cheat-sheet)

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

## Devops Considerations

### Database Management
- All changes to table structure in aws RDS will be done manually. These changes need to somehow be reflected in the schemas in the git repository so that the local development environment will mimic the cloud environment
- The database and tables will be generated automatically in all environments. For the release environment, the entire database will be refreshed on each deploy.
- All changes to database sprocs will be made in code. These changes will be automatically made to the db when the application is deployed

### App Deployment
- The retina Elastic Beanstalk (EB) application will be created manually
- All environments within the retina application will be created manually
- The configuration for the environments will go in `\*.config` files under the `.ebextensions` directory
- All deployments of the application will happen through travis-ci (need to see about restricting deployments from the command line.)


## Contributing
If you add npm packages, make sure you use the --save flag, eg. `npm install <package_name> --save`
