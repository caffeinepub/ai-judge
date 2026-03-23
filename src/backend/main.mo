import Text "mo:core/Text";
import Time "mo:core/Time";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Nat "mo:core/Nat";
import Order "mo:core/Order";

actor {
  // Types
  type UserId = Principal;
  type CaseId = Nat;

  type CaseStatus = { #pending; #analyzed };

  type ConflictCase = {
    id : CaseId;
    owner : UserId;
    title : Text;
    description : Text;
    otherPartyDescription : ?Text;
    timestamp : Int;
    status : CaseStatus;
  };

  type Verdict = {
    caseId : CaseId;
    party1FaultPercentage : Nat;
    party2FaultPercentage : Nat;
    verdictStatement : Text;
    party1Advice : [Text];
    party2Advice : [Text];
    recommendedSolution : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  // Initialize access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let cases = Map.empty<CaseId, ConflictCase>();
  let verdicts = Map.empty<CaseId, Verdict>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextCaseId = 0;

  module ConflictCase {
    public func compareByTimestamp(a : ConflictCase, b : ConflictCase) : Order.Order {
      Nat.compare(b.id, a.id);
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Submit a new case
  public shared ({ caller }) func submitCase(title : Text, description : Text, otherPartyDescription : ?Text) : async CaseId {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can submit cases");
    };

    let caseId = nextCaseId;
    nextCaseId += 1;

    let newCase : ConflictCase = {
      id = caseId;
      owner = caller;
      title;
      description;
      otherPartyDescription;
      timestamp = Time.now();
      status = #pending;
    };

    cases.add(caseId, newCase);
    caseId;
  };

  // Analyze a case and store verdict
  public shared ({ caller }) func analyzeCase(caseId : CaseId) : async Verdict {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can analyze cases");
    };
    let conflictCase = switch (cases.get(caseId)) {
      case (null) { Runtime.trap("Case not found") };
      case (?c) { c };
    };

    if (conflictCase.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Not case owner");
    };

    let verdict = analyzeDescription(conflictCase.description, conflictCase.otherPartyDescription);
    let verdictWithId = {
      caseId = caseId;
      party1FaultPercentage = verdict.party1FaultPercentage;
      party2FaultPercentage = verdict.party2FaultPercentage;
      verdictStatement = verdict.verdictStatement;
      party1Advice = verdict.party1Advice;
      party2Advice = verdict.party2Advice;
      recommendedSolution = verdict.recommendedSolution;
    };
    verdicts.add(caseId, verdictWithId);
    let updatedCase : ConflictCase = { conflictCase with status = #analyzed };
    cases.add(caseId, updatedCase);
    verdictWithId;
  };

  // Analyze case anonymously (no persistence)
  // No authorization check needed - allows guests/anonymous users
  public query ({ caller }) func analyzeCaseAnonymous(description : Text, otherPartyDescription : ?Text) : async Verdict {
    analyzeDescription(description, otherPartyDescription);
  };

  // Get user cases with verdicts
  public query ({ caller }) func getUserCases() : async [(ConflictCase, ?Verdict)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their cases");
    };

    let combinedList = List.empty<(ConflictCase, ?Verdict)>();
    
    cases.forEach(
      func(_, c) {
        if (c.owner == caller) {
          let v = switch (c.status) {
            case (#analyzed) { verdicts.get(c.id) };
            case (_) { null };
          };
          combinedList.add((c, v));
        };
      }
    );
    
    combinedList.toArray();
  };

  // Helper function to analyze description and generate verdict
  func analyzeDescription(description : Text, otherPartyDescription : ?Text) : Verdict {
    let faults = analyzeFault(description, otherPartyDescription);
    {
      caseId = 0;
      party1FaultPercentage = faults.party1;
      party2FaultPercentage = faults.party2;
      verdictStatement = generateVerdictStatement(faults.party1, faults.party2);
      party1Advice = generateAdvice(#party1, faults.party1);
      party2Advice = generateAdvice(#party2, faults.party2);
      recommendedSolution = generateRecommendedSolution(faults.party1, faults.party2);
    };
  };

  // Analyze fault percentages based on keywords
  func analyzeFault(description : Text, otherPartyDescription : ?Text) : { party1 : Nat; party2 : Nat } {
    let lowerCaseDescription = description.toLower();

    // Keyword-based heuristics
    let map = func(s : Text) : Bool { lowerCaseDescription.contains(#text(s)) };
    let manipulation = map("manipulat");
    let lying = map("lie");
    let ignoring = map("ignor");
    let disrespect = map("disrespec");
    let aggression = map("aggress");
    let communicationFailure = map("communicat");
    let conflict = map("conflict");
    let misunderstanding = map("misunderstand");
    let blame = map("blame");
    let fault = map("fault");

    var party1Base = 50;
    var party2Base = 50;

    // Adjust percentages based on detected keywords
    party1Base += (
      if (manipulation or lying) { 10 } else { 0 }
    );
    party2Base += (
      if (ignoring or disrespect or aggression) { 10 } else { 0 }
    );

    // Adjust for mutual conflict
    if (communicationFailure or conflict or misunderstanding) {
      party1Base := 50;
      party2Base := 50;
    };

    // Normalize to max 100%
    var total = party1Base + party2Base;
    if (total > 100) {
      let diff = total - 100;
      let halfDiff = diff / 2;
      if (party1Base > party2Base) {
        party1Base -= halfDiff;
      } else {
        party2Base -= halfDiff;
      };
    };

    { party1 = party1Base; party2 = party2Base };
  };

  // Generate verdict statement based on fault percentages
  func generateVerdictStatement(p1Fault : Nat, p2Fault : Nat) : Text {
    if (p1Fault > p2Fault) {
      "Party 1 (the user) is primarily at fault.";
    } else if (p2Fault > p1Fault) {
      "Party 2 (the other person) is primarily at fault.";
    } else {
      "Responsibility is shared equally between Party 1 and Party 2.";
    };
  };

  // Generate advice based on responsible party
  func generateAdvice(party : { #party1; #party2 }, faultPercentage : Nat) : [Text] {
    let adviceList = List.empty<Text>();

    if (party == #party1 and faultPercentage > 60) {
      adviceList.add("Take responsibility for your actions.");
      adviceList.add("Apologize sincerely to the other party.");
      adviceList.add("Reflect on your behavior and consider making positive changes.");
    } else if (party == #party2 and faultPercentage > 60) {
      adviceList.add("Have an open and honest conversation with the other party.");
      adviceList.add("Set healthy boundaries and express your needs.");
      adviceList.add("Seek to understand the other person's perspective.");
    } else {
      adviceList.add("Both parties should focus on improving communication and understanding.");
      adviceList.add("Practice active listening and empathy.");
    };

    adviceList.toArray();
  };

  // Generate recommended solution
  func generateRecommendedSolution(p1Fault : Nat, p2Fault : Nat) : Text {
    if (p1Fault > 60) {
      "Party 1 should take responsibility, apologize, and work on rebuilding trust.";
    } else if (p2Fault > 60) {
      "Party 2 should try to understand the impact of their actions and consider making positive changes.";
    } else {
      "Both parties should focus on improving communication and finding common ground.";
    };
  };
};
