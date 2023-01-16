FROM osixia/openldap:latest

ENV LDAP_ORGANISATION="Employee Development Application LDAP Test server" \
    LDAP_DOMAIN="grow.app"

COPY bootstrap.ldif /container/service/slapd/assets/config/bootstrap/ldif/50-bootstrap.ldif