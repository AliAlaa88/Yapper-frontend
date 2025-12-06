import { exploreServiceReal } from "./exploreService.real";
import { exploreServiceMock } from "./exploreService.mock";

export function exploreService() {
    const isMock = false;
    return isMock ? exploreServiceMock() : exploreServiceReal();
}