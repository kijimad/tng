import { describe, expect, test } from "vitest";
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { render } from "../../test/render";
import { FeedCard } from "./FeedCard";
import type { Feed } from "../../types";

describe("FeedCard", () => {
  const mockFeed: Feed = {
    event: "apply",
    data: {
      id: 1,
      is_mine: false,
      bookmarked: false,
      is_first_post: false,
      message: null,
      must_read: false,
      created_at: "2026-03-13T20:34:21.000+09:00",
      updated_at: "2026-03-13T20:34:22.000+09:00",
      created_at_label: "2時間前",
      created_at_formated: "2026.03.13 20:34:21",
      system_message: "が日報を提出しました！",
      user: {
        id: 1,
        greeting: null,
        name: "テスト ユーザー",
        birth_place: null,
        icon_path: "https://example.com/icon.png",
        profile_path: "/users/1/profile",
        standard: true,
        department: "開発部",
        department_id: 1,
        department_title: "",
      },
      menu: {
        id: 1,
        title: "日報",
        introduction: "",
        template_type: "daily_report_template",
        description: "日報を提出します",
        thumbnail_path: "https://example.com/menu.png",
      },
      apply: {
        id: 1,
        status: "success",
        applied_at: "2026-03-13T20:34:15.000+09:00",
        edit_report_path: "/reports/1/edit",
        visible_item_title: true,
        substances: [
          {
            id: 1,
            item_type: "textarea",
            key: "今日やったこと",
            value: "コードレビューを行いました",
          },
        ],
        images: [],
        products: [],
        documents: [],
        videos: [],
      },
      read: {
        feed_id: 1,
        count: 5,
        is_read: true,
        is_finished_read: true,
      },
    },
  };

  test("ユーザー名を表示する", () => {
    render(<FeedCard feed={mockFeed} />);
    expect(screen.getByText("テスト ユーザー")).toBeInTheDocument();
  });

  test("部署名を表示する", () => {
    render(<FeedCard feed={mockFeed} />);
    expect(screen.getByText("開発部")).toBeInTheDocument();
  });

  test("メニュータイトルを表示する", () => {
    render(<FeedCard feed={mockFeed} />);
    expect(screen.getByText("日報")).toBeInTheDocument();
  });

  test("投稿内容を表示する", () => {
    render(<FeedCard feed={mockFeed} />);
    expect(screen.getByText("コードレビューを行いました")).toBeInTheDocument();
  });

  test("投稿日時ラベルを表示する", () => {
    render(<FeedCard feed={mockFeed} />);
    expect(screen.getByText("2時間前")).toBeInTheDocument();
  });
});
