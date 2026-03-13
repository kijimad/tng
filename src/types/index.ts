export interface Session {
  readonly token: string;
}

export interface User {
  readonly id: number;
  readonly name: string;
  readonly icon_path: string;
  readonly profile_path: string;
  readonly department: string | null;
  readonly department_id: number | null;
  readonly department_title: string | null;
  readonly greeting: string | null;
  readonly birth_place: string | null;
  readonly standard: boolean;
}

export interface CurrentUser {
  readonly id: number;
  readonly name: string;
  readonly email?: string;
}

export interface Menu {
  readonly id: number;
  readonly title: string;
  readonly introduction: string;
  readonly template_type: string;
  readonly description: string;
  readonly thumbnail_path: string;
}

export interface Substance {
  readonly id: number;
  readonly item_type: string;
  readonly key: string;
  readonly value: string;
}

export interface FeedImage {
  readonly caption: string;
  readonly thumbnail: string;
  readonly thumbnail_vertical: string;
  readonly thumbnail_horizontal: string;
  readonly image: string;
  readonly original_image: string;
  readonly width: number;
  readonly height: number;
}

export interface Apply {
  readonly id: number;
  readonly status: string;
  readonly applied_at: string;
  readonly edit_report_path: string;
  readonly visible_item_title: boolean;
  readonly substances: readonly Substance[];
  readonly images: readonly FeedImage[];
  readonly products: readonly unknown[];
  readonly documents: readonly unknown[];
  readonly videos: readonly unknown[];
}

export interface ReadInfo {
  readonly feed_id: number;
  readonly count: number;
  readonly is_read: boolean;
  readonly is_finished_read: boolean;
}

export interface FeedData {
  readonly id: number;
  readonly is_mine: boolean;
  readonly bookmarked: boolean;
  readonly is_first_post: boolean;
  readonly message: string | null;
  readonly must_read: boolean;
  readonly created_at: string;
  readonly updated_at: string;
  readonly created_at_label: string;
  readonly created_at_formated: string;
  readonly system_message: string;
  readonly user: User;
  readonly menu: Menu | null;
  readonly apply: Apply | null;
  readonly read: ReadInfo;
}

export interface Feed {
  readonly event: string;
  readonly data: FeedData;
}

export interface FeedGroup {
  readonly id: number;
  readonly feed_ids: readonly number[];
  readonly first_grouping_id: number;
  readonly base_date: string;
  readonly title: string;
  readonly icon_path: readonly string[];
}

export interface GroupedFeedItem {
  readonly grouped: true;
  readonly feed_group: FeedGroup;
}

export interface UngroupedFeedItem {
  readonly grouped: false;
  readonly feed: {
    readonly id: number;
  };
}

export type FeedIndexItem = GroupedFeedItem | UngroupedFeedItem;

export type FeedIndex = readonly FeedIndexItem[];
