import { exploreServiceReal } from "./exploreService.real";
import { exploreServiceMock } from "./exploreService.mock";

export function exploreService() {
    const isMock = true;
    return isMock ? exploreServiceMock() : exploreServiceReal();
}