import test from "ava";
import {HistoryService} from "./history-service";
import {ToString} from "../utils";

test('HistoryService: Common', test => {
	test.is(ToString(new HistoryService()), 'edde-js/history/history-service');
});
