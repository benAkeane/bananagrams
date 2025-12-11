import fetch from 'node-fetch';
import * as dotenv from 'dotenv'
dotenv.config();

const API_KEY = process.env.MW_API_KEY!;
const BASE_URL = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json';

export async function isWordValid(word: string): Promise<boolean> {
    const lower_word = word.toLowerCase(); // make words lowercase since API is case-sensitive
    const url = `${BASE_URL}/${lower_word}?key=${API_KEY}`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            return false;
        }

        const data: unknown = await res.json();

        if (!Array.isArray(data)) {
            return false;
        }

        // Merriam-Webster returns [] for invalid words
        if (data.length === 0) {
            return false;
        }

        return typeof data[0] === 'object' && data[0] !== null;
    } catch (err) {
        console.error('Dictionary API error:', err);
        return false;
    }
}