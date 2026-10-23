// Contact form nominations: ?service= preselection. Run with: npm run test
import { test } from "node:test";
import assert from "node:assert/strict";
import { NOMINATION_SERVICES, isNomination, serviceFromQuery } from "@/lib/initiatives/nominations";

test("?service=parallel preselects the Parallel suggestion, ?service=commons the Commons nomination", () => {
  assert.equal(serviceFromQuery("parallel"), "Parallel suggestion");
  assert.equal(serviceFromQuery("commons"), "Commons nomination (pro bono)");
  assert.equal(serviceFromQuery(["commons", "parallel"]), "Commons nomination (pro bono)", "first of a repeated ?service");
});

test("unknown values are ignored", () => {
  for (const bad of [undefined, null, "", "Parallel", "brand-identity", "foundry", "toString", "__proto__", 1, ["x"]]) {
    assert.equal(serviceFromQuery(bad), "", String(bad));
  }
});

test("only the two nominations hide the budget; their values stay short plain text", () => {
  assert.equal(isNomination(NOMINATION_SERVICES.parallel), true);
  assert.equal(isNomination(NOMINATION_SERVICES.commons), true);
  for (const other of ["", "Brand Identity", "Multiple Services", "Not sure"]) assert.equal(isNomination(other), false, other);
  for (const v of Object.values(NOMINATION_SERVICES)) assert.ok(v.length <= 80, "within the lead API's 80 character cap");
});
