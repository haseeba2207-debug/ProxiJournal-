export type Attachment = {
id: string;
uri: string;
name: string;
type: string;
size?: number;
};

export type Note = {
id: string;
title: string;
body: string;
timestamp: string;
tags: string[];
audioUri?: string;
attachments: Attachment[];
synced: boolean;
};

export type CreateNoteInput = {
title: string;
body: string;
tags: string[];
audioUri?: string;
attachments: Attachment[];
};

export type UpdateNoteInput = {
title?: string;
body?: string;
tags?: string[];
audioUri?: string;
attachments?: Attachment[];
synced?: boolean;
};
