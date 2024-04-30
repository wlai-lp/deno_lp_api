export interface Domains {
    baseURIs: BaseURIs[];
}

export interface BaseURIs {
    service: string;
    account: string;
    baseURI: string;
}

export interface LPConfig {
    siteId: string;
    userName: string;
    password: string;
    bearer?: string;
}

export interface AgentVep {
    csrf:                   string;
    wsuk:                   string;
    config:                 Config;
    csdsCollectionResponse: CsdsCollectionResponse;
    accountData:            AccountData;
    sessionTTl:             string;
    bearer:                 string;
    sessionId:              string;
}

export interface AccountData {
    agentGroupsData: AgentGroupsData;
}

export interface AgentGroupsData {
    items:    Item[];
    revision: number;
}

export interface Item {
    id:      number;
    deleted: boolean;
    name:    string;
}

export interface Config {
    loginName:          string;
    userId:             string;
    userPid:            string;
    userPrivileges:     number[];
    serverCurrentTime:  number;
    timeDiff:           number;
    serverTimeZoneName: string;
    serverTimeGMTDiff:  number;
    isLPA:              boolean;
    isAdmin:            boolean;
    accountTimeZoneId:  string;
}

export interface CsdsCollectionResponse {
    baseURIs: BaseURIs[];
}

export interface BaseURIs {
    account: string;
    baseURI: string;
    service: string;
}

export interface MsgHistoryPayload {
    status:               string[];
    start:                Start;
    contentToRetrieve:    string[];
    cappingConfiguration: string;
}

export interface Start {
    from: number;
    to:   number;
}


// msg history response
export interface MsgHistoryResponseJSON {
    _metadata:                  Metadata;
    conversationHistoryRecords: ConversationHistoryRecord[];
}

export interface Metadata {
    count:              number;
    self:               Self;
    shardsStatusResult: ShardsStatusResult;
}

export interface Self {
    rel:  string;
    href: string;
}

export interface ShardsStatusResult {
    partialResult: boolean;
}

export interface ConversationHistoryRecord {
    info:                 Info;
    campaign:             Campaign;
    messageRecords:       MessageRecord[];
    consumerParticipants: ConsumerParticipant[];
    sdes:                 Sdes;
    monitoring:           Monitoring;
    pageView:             any[];
}

export interface Campaign {
    campaignEngagementId:   string;
    campaignEngagementName: string;
    campaignId:             string;
    campaignName:           string;
    goalId:                 string;
    goalName:               string;
    engagementSource:       string;
    visitorBehaviorId:      string;
    visitorBehaviorName:    string;
    visitorProfileId:       string;
    visitorProfileName:     string;
    lobId:                  number;
    lobName:                string;
    locationId:             string;
    locationName:           string;
    profileSystemDefault:   boolean;
    behaviorSystemDefault:  boolean;
}

export interface ConsumerParticipant {
    participantId: ParticipantID;
    firstName:     string;
    time:          string;
    timeL:         number;
    joinTime:      string;
    joinTimeL:     number;
    consumerName:  string;
    dialogId:      string;
}

export enum ParticipantID {
    F10395141F63199033De857F609385128A1Bec6A14221Cd587A79A58F26C2943 = "f10395141f63199033de857f609385128a1bec6a14221cd587a79a58f26c2943",
    The3729837938 = "3729837938",
    The4028425338 = "4028425338",
}

export interface Info {
    startTime:              string;
    startTimeL:             number;
    endTime:                string;
    endTimeL:               number;
    conversationEndTime:    string;
    conversationEndTimeL:   number;
    fullDialogEndTime:      string;
    fullDialogEndTimeL:     number;
    duration:               number;
    conversationId:         string;
    brandId:                string;
    latestAgentId:          string;
    latestAgentNickname:    string;
    latestAgentFullName:    string;
    latestAgentLoginName:   string;
    agentDeleted:           boolean;
    latestSkillId:          number;
    latestSkillName:        string;
    source:                 Source;
    closeReason:            string;
    closeReasonDescription: string;
    mcs:                    number;
    alertedMCS:             number;
    status:                 string;
    fullDialogStatus:       string;
    firstConversation:      boolean;
    device:                 string;
    browser:                string;
    browserVersion:         string;
    operatingSystem:        string;
    operatingSystemVersion: string;
    latestAgentGroupId:     number;
    latestAgentGroupName:   string;
    latestQueueState:       string;
    isPartial:              boolean;
    visitorId:              string;
    sessionId:              string;
    interactionContextId:   string;
    timeZone:               string;
    features:               string[];
    language:               string;
    integration:            string;
    integrationVersion:     string;
    appId:                  string;
    ipAddress:              string;
    latestHandlerAccountId: string;
    latestHandlerSkillId:   number;
}

export enum Source {
    Shark = "SHARK",
}

export interface MessageRecord {
    type:               Type;
    messageData:        MessageData;
    messageId:          string;
    audience:           Audience;
    seq:                number;
    dialogId:           string;
    participantId:      ParticipantID;
    source:             Source;
    time:               string;
    timeL:              number;
    integrationSource:  Source;
    device?:            string;
    sentBy:             SentBy;
    contextData?:       ContextData;
    predefinedContent?: boolean;
}

export enum Audience {
    All = "ALL",
}

export interface ContextData {
    rawMetadata:        string;
    structuredMetadata: any[];
}

export interface MessageData {
    msg: Msg;
}

export interface Msg {
    text: string;
}

export enum SentBy {
    Agent = "Agent",
    Consumer = "Consumer",
}

export enum Type {
    TextPlain = "TEXT_PLAIN",
}

export interface Monitoring {
    country:                    string;
    countryCode:                string;
    state:                      string;
    city:                       string;
    isp:                        string;
    org:                        string;
    device:                     string;
    ipAddress:                  string;
    browser:                    string;
    operatingSystem:            string;
    conversationStartPage:      string;
    conversationStartPageTitle: string;
}

export interface Sdes {
    events: Event[];
}

export interface Event {
    customerInfo:    EventCustomerInfo;
    serverTimeStamp: number;
    sdeType:         string;
}

export interface EventCustomerInfo {
    serverTimeStamp:   number;
    originalTimeStamp: number;
    customerInfo:      CustomerInfoCustomerInfo;
}

export interface CustomerInfoCustomerInfo {
    customerId: string;
    userName:   string;
}

export type MsgHistPayload = {
    status: ["OPEN", "CLOSE"];
    start: {
        from: number;
        to: number;
    };
    contentToRetrieve: [
        "messageRecords",
        "agentParticipants",
        "consumerParticipants",
        "sdes",
        "responseTime",
        "transfers",
        "dialogs",
        "summary",
        "conversationSurveys",
        "unAuthSdes"
    ];
    cappingConfiguration: string;
};
