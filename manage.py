#!/usr/bin/env python
"""
Custom manage.py for use with the appengine SDK
"""
# stdlib imports
import os
import subprocess
import sys
import time


if __name__ == "__main__":

    # Don't allow the `runserver` management command, run dev_appserver.py
    # directly with the subprocess module
    if 'runserver' in sys.argv:
        try:
            subprocess.call(['dev_appserver.py', '.', '--require_indexes'])
        except KeyboardInterrupt:
            # catch a keyboard interrupt and give the SDK time to shut down
            # properly before exiting
            time.sleep(3)
        sys.exit(0)

    # setup our django environment so that it runs nicely inside the appengine
    # sandbox, we don't need/want to do this if we're using `runserver`, so we
    # wait until here to import it
    from compat.environ import setup_environ
    setup_environ()

    # set the location of the default settings module
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    # run the specified management command
    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)
