// src/services/api.js
import axios from "axios";

const API_BASE = "https://brand-mention-reputation-tracker-ft6i.onrender.com/api";

export const searchKeyword = async (query) => {
  return axios.post(`${API_BASE}/search`, { query }); // starts polling
};

export const fetchMentions = async (keyword) => {
  return axios.get(`${API_BASE}/mentions/${keyword}/fetch`);
};

export const fetchAlerts = async (keyword) => {
  return axios.get(`${API_BASE}/mentions/alerts?keyword=${keyword}`);
};