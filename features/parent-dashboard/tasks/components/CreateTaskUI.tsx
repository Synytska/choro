import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Icons } from "@/components/ui/AppIcon";
import { Button } from "@/components/ui/Button";
import { CustomSwitch } from "@/components/ui/CustomSwitch";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { MultiSelect } from "@/components/ui/MultiSelect";
import PageView from "@/components/ui/PageView";
import { CustomScrollView } from "@/components/ui/ScrollView";
import { SelectablePicker } from "@/components/ui/SelectablePicker";
import { Stepper } from "@/components/ui/Stepper";
import { globalStyles } from "@/features/styles";
import { useAppColors } from "@/hooks/use-app-colors";
import { repeatDays, screenBackground, scrollViewTop, taskEmojiOptions } from "@/lib/constants";
import { MultiSelectOption } from "@/lib/types";

import { useChildren } from "../../children/hooks/useChildren";
import { useCreateTask } from "../hooks/useCreateTask";

type CreateTaskMultiSelectId = "children" | "days";

export function CreateTask() {
  const colors = useAppColors();
  const router = useRouter();
  const { t } = useTranslation();

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedIcon, setSelectedIcon] = useState(taskEmojiOptions[0]);
  const [coinReward, setCoinReward] = useState(1);
  const [isEnabled, setIsEnabled] = useState(false);
  const [openSelect, setOpenSelect] = useState<CreateTaskMultiSelectId | null>(null);

  const { data: dashboardData } = useChildren();
  const createTask = useCreateTask();

  const children = (dashboardData?.children ?? []).map((ch) => ({
    id: ch.id,
    label: ch.name,
    value: ch.name,
  })) as MultiSelectOption[];

  const repeatDayOptions = useMemo<MultiSelectOption[]>(
    () =>
      repeatDays.map((day) => ({
        id: day.id,
        label: t(day.labelKey),
        value: t(day.valueKey),
      })),
    [t],
  );

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
    <PageView screen={screenBackground.parent}>
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
            <ThemedView
              style={[
                styles.stepperWrapper,
                { borderColor: colors.middleGrey },
                globalStyles.shadow,
              ]}
            >
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

        <View style={styles.button}>
          <Button
            onPress={onCreateTask}
            disabled={!taskTitle.trim() || !selectedChildren.length || createTask.isPending}
          >
            {t("parent.tasks.createTask")}
          </Button>
        </View>
      </CustomScrollView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  fakeButton: {
    width: 40,
  },
  button: {
    paddingVertical: 20,
  },
  scrollView: {
    gap: 16,
    marginTop: scrollViewTop,
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
});
