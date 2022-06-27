"use strict";

import roofTopService from "./services/RoofTopService.js";

const check = async (blocks, token) => {
  let [base] = blocks;
  const newBlocks = [base];
  blocks.shift();
  while (blocks.length > 1) {
    for (let index = 0; index < blocks.length; index++) {
      const block = blocks[index];

      const checking = await roofTopService.check([base, block], token);
      if (checking === true) {
        base = block;
        newBlocks.push(base);
        blocks.splice(index, 1);
        break;
      }
    }
  }
  newBlocks.push(blocks[0]);
  return newBlocks;
};

export const main = async () => {
  const token = await roofTopService.getToken();
  const blocks = await roofTopService.getBlocks(token);
  const result = await check(blocks, token);
  console.log(result);
  return result;
};

main();