import { CHAR_TYPES } from "../types";

interface briefingValue {
  content: any,
}

type briefingMenu = {[name: string] : briefingValue}

type briefingObjective = {id: string, content: any}

interface briefingI {
  main: {
    main: briefingValue,
    notes: briefingValue,
    end1: briefingValue,
    end2: briefingValue,
    end3: briefingValue,
    end4: briefingValue,
    end5: briefingValue,
    end6: briefingValue,
  }
  side: {
    mainWest: briefingValue,
    mainEast: briefingValue,
    mainRes: briefingValue,
    mainCiv: briefingValue,
  },
  extra: briefingMenu,
  memory: {
    showSideSpecific: boolean,
    currentlySelected: string,
    currentlySelectedObjective: string,
  },
  objectives: briefingObjective[]
}

export function createBasicBriefingValue() {
  return {
    content: {},
  };
}

export function createBasicBriefingObjective(id: string) {
  return {
    id,
    content: {},
  };
}

const briefing: briefingI = {
  main: {
    main: createBasicBriefingValue(),
    notes: createBasicBriefingValue(),
    end1: createBasicBriefingValue(),
    end2: createBasicBriefingValue(),
    end3: createBasicBriefingValue(),
    end4: createBasicBriefingValue(),
    end5: createBasicBriefingValue(),
    end6: createBasicBriefingValue(),
  },
  side: {
    mainWest: createBasicBriefingValue(),
    mainEast: createBasicBriefingValue(),
    mainRes: createBasicBriefingValue(),
    mainCiv: createBasicBriefingValue(),
  },
  extra: {},
  memory: {
    showSideSpecific: false,
    currentlySelected: CHAR_TYPES.STRING+'briefing/main/main',
    currentlySelectedObjective: CHAR_TYPES.STRING+'',
  },
  objectives: [],
};

export default briefing;