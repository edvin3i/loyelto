#!/usr/bin/env python
"""
Fill missing `type` inside `accounts[]` from the duplicate entry in `types[]`.
Run immediately after `anchor idl build …`.
"""
import json, sys, pathlib

idl_path = pathlib.Path(sys.argv[1])            # e.g. anchor/target/idl/exchange.json
idl_obj  = json.loads(idl_path.read_text())

# Build lookup:  {"Pool": {"kind": "struct", "fields": …}}
struct_by_name = {t["name"]: t["type"] for t in idl_obj.get("types", [])}

for acc in idl_obj.get("accounts", []):
    if "type" not in acc:                       # only if Anchor omitted it
        acc["type"] = struct_by_name[acc["name"]]

idl_path.write_text(json.dumps(idl_obj, indent=2))
print("✅  Patched", idl_path)
