# Basic example

Start a local notebook server with:

    jupyter notebook --NotebookApp.token=test-secret --NotebookApp.allow_origin=*

and serve from the root thebe-lab directory:

    python -m http.server --bind 127.0.0.1

Then navigate to http://127.0.0.1:8000/example
