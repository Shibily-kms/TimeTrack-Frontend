import { createRandomId } from './id-helper'

function offlineStartBreak() {
    let oneBreak = {
        br_id: createRandomId(5),
        start: new Date(),
        end: null,
        duration: 0
    }

    return oneBreak;
}

function offlineEndBreak(oneBreak) {
    let aBreak = JSON.parse(JSON.stringify(oneBreak))
    aBreak.end = new Date()
    aBreak.duration = parseInt((aBreak.end - new Date(aBreak.start)) / 1000);
    aBreak.offline = true
    return aBreak;
}

function offlineRegularWork(work) {
    let oneWork = {
        work,
        start: new Date(),
        end: new Date(),
        duration: 0,
    }
    return oneWork;
}

function offlineExtraWork(work) {
    let oneWork = {
        work,
        start: new Date(),
        end: new Date(),
        duration: 0,
    }
    return oneWork;
}

function offlineStartLunchBreak() {
    let oneBreak = {
        start: new Date(),
        end: null,
        duration: 0
    }
    return oneBreak;
}

function offlineEndLunchBreak(oneBreak) {
    let aBreak = JSON.parse(JSON.stringify(oneBreak))
    aBreak.end = new Date()
    aBreak.duration = parseInt((aBreak.end - new Date(aBreak.start)) / 1000);
    return aBreak;
}

export {
    offlineStartBreak, offlineEndBreak, offlineRegularWork, offlineExtraWork, offlineStartLunchBreak,
    offlineEndLunchBreak
}