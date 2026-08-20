import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Icons } from "@/components/ui/AppIcon";
import { CustomSwitch } from "@/components/ui/CustomSwitch";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { MultiSelect } from "@/components/ui/MultiSelect";
import PageView from "@/components/ui/PageView";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { SelectablePicker } from "@/components/ui/SelectablePicker";
import { Stepper } from "@/components/ui/Stepper";
import { Palette } from "@/constants/theme";
import { globalStyles } from "@/features/styles";
import {
  androidBottomPadding,
  repeatDays,
  role,
  scrollViewTop,
  taskCategories,
  taskCategoryOptions,
  taskEmojiOptions,
} from "@/lib/constants";
import { MultiSelectOption, TaskCategory } from "@/lib/types";

import { useChildren } from "../../children/hooks/useChildren";
import { useCreateTask } from "../hooks/useCreateTask";

type CreateTaskMultiSelectId = "children" | "days";

export function CreateTask() {
  const router = useRouter();
  const { t } = useTranslation();
  const { childId } = useLocalSearchParams<{ childId?: string }>();

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedIcon, setSelectedIcon] = useState(taskEmojiOptions[0]);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>(taskCategories.cleaning);
  const [coinReward, setCoinReward] = useState(1);
  const [isEnabled, setIsEnabled] = useState(false);
  const [openSelect, setOpenSelect] = useState<CreateTaskMultiSelectId | null>(null);
  const initialChildApplied = useRef(false);

  const { data: dashboardData } = useChildren();
  const createTask = useCreateTask();

  const children = useMemo<MultiSelectOption[]>(
    () =>
      (dashboardData?.children ?? []).map((ch) => ({
        id: ch.id,
        label: ch.name,
        value: ch.name,
      })),
    [dashboardData?.children],
  );

  const repeatDayOptions = useMemo<MultiSelectOption[]>(
    () =>
      repeatDays.map((day) => ({
        id: day.id,
        label: t(day.labelKey),
        value: t(day.valueKey),
      })),
    [t],
  );

  useEffect(() => {
    if (initialChildApplied.current || !childId) return;

    const childExists = children.some((child) => child.id === childId);

    if (!childExists) return;

    setSelectedChildren([childId]);
    initialChildApplied.current = true;
  }, [childId, children]);

  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
    setOpenSelect(null);
    setSelectedDays([]);
  };

  const setMultiSelectOpen = (selectId: CreateTaskMultiSelectId, nextIsOpen: boolean) => {
    setOpenSelect(nextIsOpen ? selectId : null);
  };

  const handleBack = () => {
    router.back();
  };

  const onCreateTask = () => {
    createTask.mutate(
      {
        childIds: selectedChildren,
        title: taskTitle,
        description: taskDescription,
        emoji: selectedIcon,
        category: selectedCategory,
        coinReward,
        repeatDays: isEnabled ? selectedDays : [],
      },
      {
        onSuccess: () => {
          router.back();
        },
      },
    );
  };

  const increase = () => {
    setCoinReward((currentValue) => currentValue + 1);
  };

  const decrease = () => {
    setCoinReward((currentValue) => Math.max(1, currentValue - 1));
  };

  return (
    <PageView
      screen={role.parent}
      buttons={[
        {
          title: t("parent.tasks.createTask"),
          onPress: onCreateTask,
          disabled: !taskTitle.trim() || !selectedChildren.length || createTask.isPending,
        },
      ]}
    >
      <View style={styles.headerWrapper}>
        <IconButton round onPress={handleBack} icon={Icons.chevronLeft} size={40} />
        <ThemedText style={styles.header}>{t("parent.tasks.createTask")}</ThemedText>
        <View style={styles.fakeButton} />
      </View>

      <CustomScrollView contentContainerStyle={styles.scrollView}>
        {/* Inputs */}
        <Input
          label={t("parent.tasks.taskTitle")}
          placeholder={t("parent.tasks.taskPlaceholder")}
          onChangeText={setTaskTitle}
          value={taskTitle}
        />
        <Input
          label={t("common.description")}
          inputType="textarea"
          placeholder={t("parent.tasks.descriptPlaceholder")}
          onChangeText={setTaskDescription}
          value={taskDescription}
        />
        <AddCategory
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Assign to kid */}
        <MultiSelect
          label={t("parent.tasks.assignTo")}
          options={children}
          selectedValues={selectedChildren}
          onChange={setSelectedChildren}
          isOpen={openSelect === "children"}
          onOpenChange={(nextIsOpen) => setMultiSelectOpen("children", nextIsOpen)}
          placeholder={t("common.select")}
        />

        {/* Toggle */}
        <View style={styles.switchWrapper}>
          <View style={styles.switchTextWrapper}>
            <ThemedText style={styles.switchTitle}>{t("parent.tasks.repeatTask")}</ThemedText>
            <ThemedText type="subtitle">{t("parent.tasks.scheduleChore")}</ThemedText>
          </View>
          <View>
            <CustomSwitch onValueChange={toggleSwitch} value={isEnabled} />
          </View>
        </View>

        {/* Reward coins and days */}
        <View style={styles.repeatSettingsRow}>
          <View style={styles.rewardWrapper}>
            <ThemedText style={styles.rewardTitle}>{t("parent.tasks.rewardCoins")}</ThemedText>
            <ThemedView style={[styles.stepperWrapper, globalStyles.shadow]}>
              <Stepper
                value={coinReward}
                increase={increase}
                decrease={decrease}
                style={styles.stepper}
              />
            </ThemedView>
          </View>

          {/* Repeat Days */}
          <MultiSelect
            disabled={!isEnabled}
            style={styles.repeatDaysSelect}
            label={t("parent.tasks.repeatDays")}
            options={repeatDayOptions}
            selectedValues={selectedDays}
            optionsContainerHeight={120}
            onChange={setSelectedDays}
            isOpen={openSelect === "days"}
            onOpenChange={(nextIsOpen) => setMultiSelectOpen("days", nextIsOpen)}
            placeholder={!isEnabled ? t("parent.tasks.onlyToday") : t("parent.tasks.selectDays")}
          />
        </View>

        {/* Add Icon */}

        <SelectablePicker
          title={t("common.icon")}
          data={taskEmojiOptions}
          selectedValue={selectedIcon}
          getKey={(item) => item}
          onSelect={(item) => setSelectedIcon(item)}
          renderOption={(item) => <Text>{item}</Text>}
        />
      </CustomScrollView>
    </PageView>
  );
}

function AddCategory({
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory: TaskCategory;
  setSelectedCategory: (value: TaskCategory) => void;
}) {
  const { t } = useTranslation();

  return (
    <View style={styles.categoryWrapper}>
      <ThemedText style={styles.categoryTitle}>{t("parent.tasks.category")}</ThemedText>
      <View style={styles.categoryOptions}>
        {taskCategoryOptions.map((category) => {
          const isSelected = category.id === selectedCategory;

          return (
            <Pressable
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: isSelected ? Palette.orange : Palette.white,
                  borderColor: isSelected ? Palette.orange : Palette.middleGrey,
                },
              ]}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <ThemedText
                style={[
                  styles.categoryText,
                  { color: isSelected ? Palette.white : Palette.darkNavy },
                ]}
              >
                {t(category.labelKey)}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fakeButton: {
    width: 40,
  },
  scrollView: {
    gap: 16,
    marginTop: scrollViewTop,
    paddingBottom: Platform.OS === "ios" ? 0 : androidBottomPadding,
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 18,
    fontWeight: 700,
  },
  switchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchTextWrapper: {
    gap: 4,
  },
  switchTitle: {
    fontSize: 15,
    fontWeight: 700,
    lineHeight: 18,
  },
  rewardWrapper: {
    gap: 8,
  },
  stepperWrapper: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Palette.middleGrey,
  },
  stepper: {
    gap: 10,
  },
  rewardTitle: {
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 15,
  },
  repeatSettingsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingTop: 10,
  },
  repeatDaysSelect: {
    flex: 1,
    minWidth: 0,
  },
  categoryWrapper: {
    gap: 12,
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 15,
    marginLeft: 4,
  },
  categoryOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    minHeight: 42,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 13,
    lineHeight: 16,
  },
});
