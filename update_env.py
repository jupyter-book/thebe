'''update_env.py

Swaps any production or staging scripts, and vice versa.
To run:

python update_env.py prod # Switches to production (CDN deployment)
python update_env.py staging # Switches to staging (local)
'''
import os
import glob
import argparse


parser = argparse.ArgumentParser(description='Update the Thebelab script \
                                 in the documentation.')
parser.add_argument('env', metavar='ENV', choices=['prod', 'staging'],
                    help='The environment the docs should point to.')
args = parser.parse_args()

docs = glob.glob('docs/*.rst')
prod = '<script src="https://unpkg.com/thebelab@latest/lib/index.js"></script>'
staging = '<script src="LOCAL/index.js"></script>' # Need to change this

# Iterate over all .rst files in /docs root.
for idx, doc in enumerate(docs):
    with open(doc, "rt") as file_r:
        with open(f'docs/{idx}.rst', "wt") as file_w:
            for line in file_r:
                # Replace any instances of the script based on env.
                if args.env == 'staging':
                    file_w.write(line.replace(prod, staging))
                else:
                    file_w.write(line.replace(staging, prod))
    # Since our new file is named `0.rst`, lets rename the original file.
    os.rename(f'docs/{idx}.rst', doc)
