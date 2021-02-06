#!/usr/bin/ssh-agent bash

ssh-add $HOME/.ssh/id_ed25519

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd $DIR/client

yarn build && \
rsync -azvP -e ssh build/* \
  deploy@relm-alt:/var/www/html/ribbon/ \
  --delete

cd $DIR/server

yarn build && \
rsync -azvP -e ssh dist/* \
  deploy@relm-alt:/home/deploy/ribbon/ \
  --delete

