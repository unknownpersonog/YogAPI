import axios from "axios";
import { DISCORD_API_URL } from "../../utils/constants";
import { PartialGuild } from "../../utils/types";
import { User } from "../../database/schemas";

export function getBotGuildsService() {
    const TOKEN = process.env.DISCORD_BOT_TOKEN;
    return axios.get<PartialGuild[]>(`${DISCORD_API_URL}/users/@me/guilds`, {
        headers: { Authorization: `Bot ${TOKEN}`}
    });
}

export async function getUserGuildsService(id: String) {
    const user = await User.findById(id);
    if (!user) throw new Error('No user found');
    return axios.get<PartialGuild[]>(`${DISCORD_API_URL}/users/@me/guilds`, {
        headers: { Authorization: `Bearer ${user.accessToken}`}
    });
}

export async function getMutualGuildsService(id: string) {
    const { data: botGuilds } = await getBotGuildsService();
    const { data: userGuilds } = await getUserGuildsService(id);

    const adminUserGuilds = userGuilds.filter(({ permissions }) => (parseInt(permissions) & 0x8) === 0x8
    );

    return adminUserGuilds.filter((guild) => 
    botGuilds.some((botGuilds) => botGuilds.id === guild.id)
    );
}