// /telegram-bot/src/bot.ts (Fichier RÉORDONNÉ et CORRIGÉ)

require('dotenv').config();

import { Telegraf, Context } from 'telegraf';
import axios from 'axios'; 
import FormData from 'form-data'; 

// --- Configuration ---
const BOT_TOKEN = process.env.BOT_TOKEN; 
const VERA_API_URL = 'http://localhost:3000/api/analyze'; 
const MEDIA_API_URL = 'http://localhost:3000/api/analyze/media'; 
const YOUTUBE_API_URL = 'http://localhost:3000/api/youtube-analysis'; 

if (!BOT_TOKEN) {
    console.error("❌ ERREUR FATALE: BOT_TOKEN manquant.");
    process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// --- Utilitaires ---
function escapeMarkdownV2(text: string): string {
    if (!text) return '';
    const specialChars = /[_\*\[\]\(\)~`>#\+\-=\|\{\}\.\!]/g;
    return text.replace(specialChars, '\\$&'); 
}

function escapeHtml(text: string): string {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// --- Fonctions d'Appel API ---

async function getVeraVerdict(content: string): Promise<string> {
    try {
        const response = await axios.post(VERA_API_URL, { content });
        const { verdict, confidence, details } = response.data;
        
        let icon = verdict.includes('FAUX') ? '❌' : verdict.includes('VRAI') ? '✅' : '💡';
        
        return `${icon} <b>VERDICT VERA</b>
Confiance : <b>${(confidence * 100).toFixed(0)}%</b>
________________

${escapeHtml(details)}`;

    } catch (error) {
        return `🚨 <b>Erreur système VERA</b>.`;
    }
}

async function sendMediaToVera(ctx: Context, fileId: string, mimeType: string, fileName: string) {
    try {
        await ctx.reply("⏳ Réception du fichier et analyse en cours...", { parse_mode: 'HTML' });

        const fileLink = await ctx.telegram.getFileLink(fileId);
        const response = await axios.get(fileLink.href, { responseType: 'arraybuffer' });
        const fileBuffer = Buffer.from(response.data);

        const form = new FormData();
        form.append('file', fileBuffer, { filename: fileName, contentType: mimeType });
        form.append('userId', `tg-${ctx.from?.id}`);

        console.log(`📤 Envoi du fichier ${fileName} au backend...`);
        const backendResponse = await axios.post(MEDIA_API_URL, form, {
            headers: { ...form.getHeaders() },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        const { verdict, confidence, details } = backendResponse.data;
        let icon = verdict.includes('FAUX') ? '❌' : verdict.includes('VRAI') ? '✅' : '📷';

        const replyMsg = `
${icon} <b>ANALYSE MÉDIA</b>
Confiance : <b>${(confidence * 100).toFixed(0)}%</b>
________________

${escapeHtml(details)}
`.trim();

        await ctx.reply(replyMsg, { parse_mode: 'HTML' });

    } catch (error) {
        console.error("❌ Erreur Media Bot:", error.message);
        await ctx.reply(`🚨 <b>ERREUR</b> : Impossible d'analyser ce fichier.`, { parse_mode: 'HTML' });
    }
}

// ============================================================
// 🎮 GESTIONNAIRES DE COMMANDES (L'ORDRE EST CRUCIAL !)
// ============================================================

// 1. START
bot.start((ctx) => {
    ctx.reply(`👋 Bonjour ! Envoyez-moi du texte, une photo, une vidéo, un audio, ou un lien YouTube (/analyse_video [url]).`);
});

// 2. COMMANDE SPÉCIFIQUE (Doit être AVANT le handler 'text')
bot.command('analyse_video', async (ctx) => {
    const messageText = ctx.message.text.trim();
    const parts = messageText.split(/\s+/); 

    if (parts.length < 2) {
        return ctx.reply("⚠️ Veuillez fournir l'URL YouTube après la commande.\nExemple: /analyse_video https://youtu.be/...", { parse_mode: 'HTML' });
    }

    const videoUrl = parts[1];
    const userId = `tg-${ctx.from?.id}`;

    // Feedback immédiat
    await ctx.reply(`📺 <b>Analyse YouTube en cours...</b>\nCela peut prendre quelques secondes.`, { parse_mode: 'HTML' });
    console.log(`[BOT] Commande YouTube reçue pour : ${videoUrl}`);

    try {
        const response = await axios.post(
            YOUTUBE_API_URL, 
            { url: videoUrl, userId },
            { timeout: 120000 } // 2 minutes timeout pour les grosses vidéos
        );
        
        const { verdict, confidence, details } = response.data;
        let icon = verdict.includes('FAUX') ? '❌' : verdict.includes('VRAI') ? '✅' : '💡';

        const finalResponse = `
${icon} <b>VERDICT VIDÉO</b>
Confiance : <b>${(confidence * 100).toFixed(0)}%</b>
________________

${escapeHtml(details)}
`.trim();

        ctx.reply(finalResponse, { parse_mode: 'HTML' });

    } catch (error) {
        console.error(`[BOT ERROR] Erreur YouTube:`, error.message);
        const status = error.response?.status || 'N/A';
        ctx.reply(`🚨 <b>ERREUR</b> : Échec de l'analyse vidéo (Code ${status}). Vérifiez que la vidéo a des sous-titres.`, { parse_mode: 'HTML' });
    }
});

// 3. TEXTE GÉNÉRIQUE (Attrape tout le reste, donc à mettre APRÈS les commandes)
bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    
    // Sécurité supplémentaire : si ça commence par /, on ignore (c'est une commande mal gérée)
    if (text.startsWith('/')) return;

    ctx.sendChatAction('typing');
    const verdict = await getVeraVerdict(text);
    ctx.reply(verdict, { parse_mode: 'HTML' });
});

// 4. MÉDIAS
bot.on('photo', (ctx) => {
    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    sendMediaToVera(ctx, photo.file_id, 'image/jpeg', `image-${photo.file_id}.jpg`);
});

bot.on('video', (ctx) => {
    const video = ctx.message.video;
    sendMediaToVera(ctx, video.file_id, video.mime_type || 'video/mp4', `video-${video.file_id}.mp4`);
});

bot.on('audio', (ctx) => {
    const audio = ctx.message.audio;
    const mime = audio.mime_type || 'audio/mpeg';
    sendMediaToVera(ctx, audio.file_id, mime, audio.file_name || `audio-${audio.file_id}.mp3`);
});

bot.on('voice', (ctx) => {
    const voice = ctx.message.voice;
    const mime = voice.mime_type || 'audio/ogg';
    sendMediaToVera(ctx, voice.file_id, mime, `voice-${voice.file_id}.ogg`);
});

// --- Lancement ---
bot.launch().then(() => console.log('🚀 Bot Telegram Démarré (Commandes, Texte, Audio, Images) !'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));