#!/bin/env python3

import argparse
import importlib

def main():
    parser = argparse.ArgumentParser(description='Run day scripts')
    parser.add_argument('day', type=str, help='Day number')

    args = parser.parse_args()
    day = 'day'+args.day.rjust(2, '0')

    try:
        lib = importlib.import_module(day+'.script')
        lib.run()
    except ModuleNotFoundError:
        print("Day",day,"not found")

if __name__ == "__main__":
    main()