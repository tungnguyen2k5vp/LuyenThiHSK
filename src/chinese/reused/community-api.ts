import { z } from 'zod';

import { avatarOptions, legacyTopics, stickers, topics, type SocialTopic } from './catalog';

import { getCommunityClient } from '../community-client';
export { topics, type SocialTopic } from './catalog';

export const profileSchema = z.object({ id: z.uuid(), handle: z.string().regex(/^[A-F0-9]{10}$/), display_name: z.string().min(1).max(40), bio: z.string().max(180), avatar: z.number().int().min(0).max(5), icon: z.number().int().min(0).max(avatarOptions.length - 1).nullable().optional(), created_at: z.string() });
export type SocialProfile = z.infer<typeof profileSchema>;
const personSchema = z.object({ profile: profileSchema, state: z.enum(['pending', 'accepted', 'declined']).nullable(), requested_by: z.uuid().nullable() });
export type SocialPerson = z.infer<typeof personSchema>;
export const attachmentSchema = z.object({ id: z.uuid(), path: z.string().regex(/^[0-9a-f-]{36}\/[0-9a-f-]{36}\.[a-z0-9]+$/), name: z.string().min(1).max(120), mime: z.string().max(120), bytes: z.number().int().positive().max(26214400) });
export type SocialAttachment = z.infer<typeof attachmentSchema>;
const topicSchema = z.enum(Object.keys(topics) as [SocialTopic, ...SocialTopic[]]);
const stickerIds = z.array(z.string().refine(id => stickers.some(s => s.id === id))).max(4).refine(ids => new Set(ids).size === ids.length);
const postSchema = z.object({ attachments: z.array(attachmentSchema).max(4).optional(), stickers: stickerIds.default([]), views: z.number().int().nonnegative().safe().default(0), id: z.uuid(), author_id: z.uuid(), author: profileSchema, body: z.string().max(3000), title: z.string().max(120).default(''), topic: topicSchema.default('general'), community_topic: topicSchema.nullable().optional(), saved: z.boolean().default(false), category: z.enum(['question', 'share', 'practice']), created_at: z.string(), deleted_at: z.string().nullable(), likes: z.number().int().nonnegative(), hearts: z.number().int().nonnegative(), comments: z.number().int().nonnegative(), reaction: z.enum(['like', 'heart']).nullable() });
export type SocialPost = z.infer<typeof postSchema>;
const commentSchema = z.object({ id: z.uuid(), post_id: z.uuid(), author_id: z.uuid(), author: profileSchema, body: z.string().max(1000), created_at: z.string() });
export type SocialComment = z.infer<typeof commentSchema>;
const sequence = z.number().int().nonnegative().safe();
export const messageEmojis = ['❤️', '👍', '😂', '😮', '😢', '加油'] as const;
export const messageSchema = z.object({ attachments: z.array(attachmentSchema).max(4).optional(), id: sequence, client_id: z.uuid(), sender_id: z.uuid(), recipient_id: z.uuid(), body: z.string().max(2000), created_at: z.string(), reply_to: sequence.nullable().optional(), reply: z.object({ id: sequence, sender_id: z.uuid(), body: z.string().max(240) }).nullable().optional(), withdrawn_at: z.string().nullable().optional(), reactions: z.array(z.object({ emoji: z.enum(messageEmojis), count: sequence, mine: z.boolean() })).max(6).optional() });
export type SocialMessage = z.infer<typeof messageSchema>;
const errors: Record<string, string> = {
  SOCIAL_MEDIA_INVALID: 'Tệp không hợp lệ. Ảnh tối đa 8 MB, video 25 MB, tài liệu 10 MB.',
  SOCIAL_MEDIA_QUOTA: 'Kho chia sẻ đã đầy. Hãy bỏ tệp nháp không dùng hoặc liên hệ quản trị viên.',
  SOCIAL_AUTH_REQUIRED: 'Phiên cộng đồng chưa sẵn sàng. Thử kết nối lại nhé.',
  SOCIAL_RATE_LIMITED: 'Bạn thao tác hơi nhanh. Hãy chờ rồi thử lại.',
  SOCIAL_NOT_FOUND: 'Nội dung không còn khả dụng hoặc người dùng đã chặn tương tác.',
  SOCIAL_FRIEND_REQUIRED: 'Hai bạn cần chấp nhận kết bạn trước khi nhắn tin.',
  SOCIAL_INVALID_STATE: 'Lời mời đã thay đổi. Hãy làm mới danh sách.',
  SOCIAL_IDEMPOTENCY_CONFLICT: 'Mã gửi đã thuộc nội dung khác. Bản nháp vẫn được giữ lại.',
  SOCIAL_BACKEND_REQUIRED: 'Phần cộng đồng chưa được cấu hình trên máy chủ.',
  SOCIAL_INVALID_INPUT: 'Thông tin chưa hợp lệ. Kiểm tra nội dung và thử lại.',
  SOCIAL_PROFILE_REQUIRED: 'Hãy mở lại mục Cộng đồng để khởi tạo hồ sơ.',
  SOCIAL_OUTBOX_FULL: 'Có 100 tin đang chờ. Hãy kết nối và gửi lại trước khi soạn thêm.',
};
export function socialError(error: unknown): string {
  const e = error as { code?: string; message?: string } | null;
  if (e?.message && errors[e.message]) return errors[e.message]!;
  const code = Object.keys(errors).find(key => e?.message?.includes(key));
  if (code) return errors[code]!;
  if (['PGRST202', '42P01', '42883', 'anonymous_provider_disabled'].includes(e?.code ?? '')) return errors.SOCIAL_BACKEND_REQUIRED!;
  if (['23514', '22P02', '23502', '22007'].includes(e?.code ?? '') || e instanceof z.ZodError) return 'Thông tin chưa hợp lệ. Kiểm tra độ dài và thử lại.';
  return 'Chưa kết nối được cộng đồng. Nội dung chưa gửi vẫn được giữ lại; hãy thử lại khi có mạng.';
}
let authentication: Promise<void> | null = null;
export async function communitySession() {
  const client = getCommunityClient();
  if (!client) throw new Error('SOCIAL_BACKEND_REQUIRED');
  if (!authentication) authentication = (async () => {
    const stored = await client.auth.getSession();
    if (stored.error) throw stored.error;
    if (!stored.data.session) { const next = await client.auth.signInAnonymously(); if (next.error) throw next.error; }
  })().finally(() => { authentication = null; });
  await authentication;
  return client;
}
export async function socialCall<T>(action: string, data: Record<string, unknown>, schema: z.ZodType<T>): Promise<T> {
  const client = await communitySession(), controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const result = await client.rpc(['profile', 'feed', 'post', 'post_view'].includes(action) ? 'social_community_api' : 'social_api', { p_action: action, p_data: data }).abortSignal(controller.signal);
    if (result.error) throw result.error;
    return schema.parse(result.data);
  } finally { clearTimeout(timeout); }
}
export const me = () => socialCall('profile', {}, profileSchema);
export const editProfile = (data: { display_name: string; bio: string; avatar: number; icon?: number }) => socialCall('profile', profileSchema.pick({ display_name: true, bio: true, avatar: true, icon: true }).parse(data), profileSchema);
export const findPerson = (handle: string) => socialCall('search', { handle: handle.trim().toUpperCase().replace(/^FC-/, '') }, personSchema.nullable());
export const getPerson = (peer: string) => socialCall('person', { peer: z.uuid().parse(peer) }, personSchema);
export const relations = (cursor: { friends_after?: string; blocked_after?: string } = {}) => socialCall('relations', z.object({ friends_after: z.uuid().optional(), blocked_after: z.uuid().optional() }).parse(cursor), z.object({ friends: z.array(personSchema).max(50), blocked: z.array(profileSchema).max(50) }));
export const friendsAction = (peer: string, verb: 'request' | 'accept' | 'decline' | 'remove') => socialCall('friend', { peer: z.uuid().parse(peer), verb }, z.literal(true));
export const blockPerson = (peer: string, active: boolean) => socialCall('block', { peer: z.uuid().parse(peer), active }, z.literal(true));
export type PageCursor = { created_at: string; id: string };
const cursorData = (cursor?: PageCursor) => cursor ? { before: cursor.created_at, before_id: cursor.id } : {};
export type FeedFilter = { category?: SocialPost['category']; topic?: SocialTopic; query?: string; saved?: boolean };
export const feed = (cursor?: PageCursor, filter: FeedFilter = {}) => socialCall('feed', { ...cursorData(cursor), ...z.object({ category: z.enum(['question', 'share', 'practice']).optional(), topic: z.enum(Object.keys(topics) as [SocialTopic, ...SocialTopic[]]).optional(), query: z.string().trim().max(80).optional(), saved: z.boolean().optional() }).parse(filter), limit: 20 }, z.array(postSchema).max(20));
export function newOperationId() {
  // Dedupe nonce, never an authentication credential. The server owns user IDs.
  return globalThis.crypto?.randomUUID?.() ?? 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const n = Math.floor(Math.random() * 16); return (c === 'x' ? n : (n & 3) | 8).toString(16);
  });
}
export function createPost(id: string, body: string, category: SocialPost['category'], extra: { title?: string; topic?: SocialTopic; attachments?: string[]; stickers?: string[] } = {}) {
  const data = postSchema.pick({ title: true, topic: true }).partial().extend({ attachments: z.array(z.uuid()).max(4).optional(), stickers: stickerIds.optional() }).parse(extra);
  return socialCall('post', { id: z.uuid().parse(id), body: z.string().trim().min(1).max(3000).parse(body), category: z.enum(['question', 'share', 'practice']).parse(category), ...data, ...(data.topic ? { topic: (legacyTopics as readonly string[]).includes(data.topic) ? data.topic : 'general', community_topic: data.topic } : {}) }, postSchema);
}
export const viewPost = (id: string) => socialCall('post_view', { id: z.uuid().parse(id) }, z.number().int().nonnegative().safe());
export const bookmarkPost = (post: string, active: boolean) => socialCall('bookmark', { post: z.uuid().parse(post), active }, z.literal(true));
export const postDetail = (id: string, cursor?: PageCursor) => socialCall('post_detail', { id: z.uuid().parse(id), ...cursorData(cursor), limit: 30 }, z.object({ post: postSchema, comments: z.array(commentSchema).max(30) }));
export const comment = (id: string, post: string, body: string) => socialCall('comment', { id: z.uuid().parse(id), post: z.uuid().parse(post), body: z.string().trim().min(1).max(1000).parse(body) }, z.literal(true));
export const react = (post: string, kind: 'like' | 'heart' | null) => socialCall('react', { post: z.uuid().parse(post), kind }, z.literal(true));
export const removeContent = (id: string, kind: 'post' | 'comment') => socialCall('delete', { id: z.uuid().parse(id), kind }, z.literal(true));
export const report = (kind: 'post' | 'message' | 'profile', id: string, reason: string) => socialCall('report', { kind, id, reason: z.string().trim().min(3).max(500).parse(reason) }, z.literal(true));
export const inbox = () => socialCall('inbox', {}, z.array(z.object({ profile: profileSchema, message: messageSchema, unread: sequence })).max(50));
export const messages = (peer: string, cursor: { before?: number; after?: number } = {}) => socialCall('messages', { peer: z.uuid().parse(peer), ...z.object({ before: sequence.optional(), after: sequence.optional() }).refine(c => c.before === undefined || c.after === undefined).parse(cursor), limit: 50 }, z.object({ messages: z.array(messageSchema).max(50), read: sequence }));
export const markRead = (peer: string, id: number) => socialCall('read', { peer: z.uuid().parse(peer), id: sequence.parse(id) }, z.literal(true));
export const sendMessage = (peer: string, id: string, body: string, replyTo?: number | null, attachments?: string[]) => socialCall('send', { peer: z.uuid().parse(peer), id: z.uuid().parse(id), body: z.string().trim().min(1).max(2000).parse(body), ...(replyTo != null ? { reply_to: sequence.parse(replyTo) } : {}), ...(attachments?.length ? { attachments: z.array(z.uuid()).max(4).parse(attachments) } : {}) }, messageSchema);
export const messageDetails = (peer: string, ids: number[]) => socialCall('message_details', { peer: z.uuid().parse(peer), ids: z.array(sequence).max(200).parse(ids) }, z.array(messageSchema).max(200));
export const reactToMessage = (peer: string, id: number, emoji: typeof messageEmojis[number] | null) => socialCall('message_react', { peer: z.uuid().parse(peer), id: sequence.parse(id), emoji: z.enum(messageEmojis).nullable().parse(emoji) }, messageSchema);
export const withdrawMessage = (peer: string, id: number) => socialCall('withdraw', { peer: z.uuid().parse(peer), id: sequence.parse(id) }, messageSchema);

/** Realtime is an invalidation hint; reload durable rows on every reconnect. */
export async function watchSocial(tables: string[], refresh: () => void, status: (connected: boolean) => void) {
  const client = await communitySession();
  const session = await client.auth.getSession();
  if (session.error || !session.data.session) throw session.error ?? new Error('SOCIAL_AUTH_REQUIRED');
  // Await token setup before joining: a newly created guest can otherwise join as anon.
  await client.realtime.setAuth(session.data.session.access_token);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const channel = client.channel(`social-${newOperationId()}`);
  for (const table of tables) {
    if (!/^social_(posts|comments|reactions|friendships|messages|reads|blocks|message_reactions|message_updates)$/.test(table)) throw new Error('SOCIAL_INVALID_INPUT');
    channel.on('postgres_changes', { event: '*', schema: 'public', table }, () => {
      clearTimeout(timer); timer = setTimeout(refresh, 180);
    });
  }
  channel.subscribe(s => { status(s === 'SUBSCRIBED'); if (s === 'SUBSCRIBED') refresh(); });
  return () => { clearTimeout(timer); void client.removeChannel(channel); };
}
