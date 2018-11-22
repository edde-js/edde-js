import test from "ava";
import {HistoryService} from "./history-service";
import {GetString} from "../utils";

test('HistoryService: Common', test => {
	test.is(GetString(new HistoryService()), 'edde-js/history/history-service');
});
