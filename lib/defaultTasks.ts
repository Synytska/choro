import { TFunction } from "i18next";

export const defaultTaskKeys = [
  "arrange",
  "makebed",
  "brushteeth",
  "serve",
  "washdishes",
  "taketrash",
  "cleanroom",
  "waterflowers",
] as const;

export type DefaultTaskKey = (typeof defaultTaskKeys)[number];

const defaultTaskTitlesByKey: Record<DefaultTaskKey, string> = {
  arrange: "Arrange the toys",
  makebed: "Make the bed",
  brushteeth: "Brush your teeth",
  serve: "Serve a table",
  washdishes: "Wash the dishes",
  taketrash: "Take out the trash",
  cleanroom: "Clean the room",
  waterflowers: "Water the flowers",
};

export const getDefaultTaskFallbackTitle = (key: DefaultTaskKey) => defaultTaskTitlesByKey[key];

export const getDefaultTaskTitle = (
  task: { defaultTaskKey?: DefaultTaskKey | null; title: string },
  t: TFunction,
) =>
  task.defaultTaskKey
    ? t(`common.tasksDefault.${task.defaultTaskKey}`, {
        defaultValue: task.title || getDefaultTaskFallbackTitle(task.defaultTaskKey),
      })
    : task.title;

export const getDefaultTaskIdentity = (task: {
  defaultTaskKey?: DefaultTaskKey | null;
  title: string;
}) => task.defaultTaskKey ?? task.title.trim().toLowerCase();
