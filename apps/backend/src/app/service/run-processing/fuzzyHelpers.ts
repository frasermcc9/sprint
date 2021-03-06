import { mapValues } from "lodash";

const and = (x: number, y: number) => Math.min(x, y);
const or = (x: number, y: number) => Math.max(x, y);
const not = (x: number) => 1 - x;

const operators = {
  and,
  or,
  not,
};

export class Fuzzy {
  private memberships = {};
  private nameToCategory = {};
  private rules = {};

  trapezoid(
    category: string | number,
    name: string | number,
    x1: number,
    x2: number,
    x3: number,
    x4: number,
  ) {
    const { memberships, nameToCategory } = {
      memberships: this.memberships,
      nameToCategory: this.nameToCategory,
    };
    const membershipFunction = (value) => {
      if (value <= x1 || value >= x4) return 0;
      if (value < x2) {
        return value / (x2 - x1);
      } else if (value > x3) {
        return 1 - (value - x3) / (x4 - x3);
      } else {
        return 1;
      }
    };
    if (!memberships[category]) memberships[category] = {};
    memberships[category][name] = membershipFunction;
    nameToCategory[name] = category;
    return this;
  }

  // for adding new rules
  if(name) {
    const { rules } = {
      rules: this.rules,
    };
    const exp = [name];

    const rule = {
      and: (name, not = false) => {
        exp.push("and");
        if (not) exp.push("not");
        exp.push(name);
        return rule;
      },
      or: (name, not = false) => {
        exp.push("or");
        if (not) exp.push("not");
        exp.push(name);
        return rule;
      },
      then: (name) => {
        rules[name] = exp;
        return this;
      },
    };
    return rule;
  }

  resolveRule(ruleFunction, obj) {
    const { memberships, nameToCategory } = {
      memberships: this.memberships,
      nameToCategory: this.nameToCategory,
    };
    ruleFunction = ruleFunction.map((e) => {
      if (!operators[e]) {
        const category = nameToCategory[e];
        return memberships[category][e](obj[category]);
      } else {
        return e;
      }
    });
    ruleFunction.forEach((e, i) => {
      if (e === "not") {
        ruleFunction[i + 1] = 1 - ruleFunction[i + 1];
      }
    });

    let finalResult = 0;
    let currentOp;
    console.log(ruleFunction);

    ruleFunction.forEach((e) => {
      if (e === "not") return;
      if (operators[e]) {
        currentOp = operators[e];
      } else {
        if (currentOp) {
          finalResult = currentOp(finalResult, e);
        } else {
          finalResult = e;
        }
      }
    });
    return finalResult;
  }

  defuzzify = (obj) => {
    return mapValues(this.rules, (ruleFunction) =>
      this.resolveRule(ruleFunction, obj),
    );
  };
}
