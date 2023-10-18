import * as fs from 'fs';
import { Settings } from '../utils/types';

export function settingsParser() {
const rawSettingsData = fs.readFileSync('settings.json', 'utf8');
const settingsData: { settings: Settings } = JSON.parse(rawSettingsData);

return settingsData.settings;
}