# How to build and deploy
1. Put all files in some folder
2. Run `docker compose up -d` from same folder
3. Done!

# How to access
1. LDAP server (to connect from other apps) is available on `127.0.0.1:389`
2. LDAP Admin interface is available on [http://127.0.0.1:8090](http://127.0.0.1:8090)
   - User: `cn=admin,dc=grow,dc=app`
   - Password: `123456`

# Test data
1. domain name is `grow.app`
2. administrator user: `admin` with password `123456`
3. developer user: `developer` with password `123456` 
