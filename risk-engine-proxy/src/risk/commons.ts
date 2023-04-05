import { ethers } from "ethers";

const TransferEvent = '0xa9059cbb';
const ApproveEvent = '0x095ea7b3';

export interface RiskEngineConfig {
  event: string,
  endpoint: string,
  abi: string[]
}

let EventsMap: {
  [key: string]: RiskEngineConfig
} = {};
// FIXME (balder): 需要风控引擎提供endpoint
EventsMap[TransferEvent] = {
  "event": "TransferEvent",
  "endpoint": "xw79o3iupgag",
  "abi": ["address", "uint256"]
};

EventsMap[ApproveEvent] = {
  "event": "ApproveEvent",
  "endpoint": "",
  "abi": ["address", "uint256"]
};

export interface RiskInfo {
  riskScore: number,
  riskLevel: number,
  riskTypeList: number[],
  riskMsgList: string[]
}

export interface Tx {
  chainId: number,
  chainName: string,
  locale: string,
  recipient: string,
  sender: string,
  contract: string,
  value?: string,
  gasPrice: string,
  gasLimit: string,
  maxFeePerGas: string,
  maxPriorityFeePerGas: string,
  nonce: number,
}

export interface TxSignObj extends Tx {
  payload: string
}

export interface TransferObj extends Tx {
  to: string,
  amount: string
}

export interface ApproveObj extends Tx {
  spender: string,
  amount: string
}

export function flattenTxSignObj(obj: TxSignObj): {data: TransferObj | ApproveObj, config: RiskEngineConfig} {
  const selector = obj.payload.substring(0, 10);
  let data = obj.payload.substring(10);
  let abiDecoder = new ethers.AbiCoder();

  if (selector == TransferEvent) {
    let transferObj: TransferObj = Object.assign({}, obj as Tx, { to: "", amount: "0" });

    let result = abiDecoder.decode(EventsMap[TransferEvent].abi, `0x${data}`);
    transferObj.to = result[0];
    transferObj.amount = result[1].toString();

    return {data: transferObj, config: EventsMap[TransferEvent]};
  } else if (selector == ApproveEvent) {
    let approveObj: ApproveObj = Object.assign({}, obj as Tx, { spender: "", amount: "0" });
    let result = abiDecoder.decode(EventsMap[ApproveEvent].abi, data);

    approveObj.spender = result[0];
    approveObj.amount = result[1].toString();

    return {data: approveObj, config: EventsMap[ApproveEvent]};
  } else {
    throw new Error("unsupport event");
  }
}

interface OfferObj {
  itemType: number,
  token: string,
  identifierOrCriteria: number,
  startAmount: number,
  endAmount: number
}

interface ConsiderationObj extends OfferObj {
  recipient: string
}

interface MsgObj {
  offerer: string,
  offer: OfferObj[] | string,
  consideration: ConsiderationObj[] | string,
  startTime: number,
  endTime: number,
  orderType: number,
  zone: string,
  zoneHash: string,
  salt: string,
  conduitKey: string,
  totalOriginalConsiderationItems: number,
  counter: number
}

export interface MsgSignObj {
  chainId: number,
  chainName: string,
  requester: string,
  locale: string,
  msgType: string,
  msg: MsgObj | string;
}

export function flattenMsgSignObj(obj: MsgSignObj): MsgSignObj {
  let flattend: MsgSignObj = Object.assign({}, obj);
  let msg = obj.msg as MsgObj;

  (flattend.msg as MsgObj).offer = JSON.stringify(msg.offer);
  (flattend.msg as MsgObj).consideration = JSON.stringify(msg.consideration);
  flattend.msg = JSON.stringify(msg);

  return flattend;
}
