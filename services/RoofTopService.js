"use strict";

import fetch from "node-fetch";
import "dotenv/config";

class RoofTopService {
  constructor() {
    this.url = "https://rooftop-career-switch.herokuapp.com";
  }

  async getToken() {
    const { EMAIL } = process.env;
    const responseToken = await fetch(`${this.url}/token?email=${EMAIL}`);
    const { token } = await responseToken.json();
    if(!token){
      throw new Error("Error with the endpoint token")
    }
    return token;
  }

  async getBlocks(token) {
    const responseBlocks = await fetch(`${this.url}/blocks?token=${token}`);
    const { data } = await responseBlocks.json();
    if(!data){
      throw new Error("Error with the endpoint blocks")
    }
    return data;
  }

  async check(blocks, token) {
    const request = JSON.stringify({
      blocks,
    });

    const response = await fetch(`${this.url}/check?token=${token}`, {
      method: "POST",
      body: request,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { message = false } = await response.json();
    if(typeof message !== "boolean"){
      throw new Error("Error with the endpoint check")
    }
    return message;
  }
}

export default new RoofTopService();
