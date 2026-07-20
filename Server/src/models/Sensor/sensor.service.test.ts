import { SensorModel } from "./sensor.models";
import { FirmModel } from "../Firm/firm.models";
import {
    getSensorByIdService,
    deleteSensorByIdService,
    verifySensorOwnership,
    UserContext,
} from "./sensor.service";

jest.mock("./sensor.models");
jest.mock("../Firm/firm.models");

const mockedSensorModel = jest.mocked(SensorModel);
const mockedFirmModel = jest.mocked(FirmModel);

describe("verifySensorOwnership", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns true for admin role", async () => {
        const userContext: UserContext = { userId: "user1", role: "admin" };
        const result = await verifySensorOwnership("sensor1", userContext);
        expect(result).toBe(true);
    });

    it("returns true when user owns the firm", async () => {
        const userContext: UserContext = { userId: "user1", role: "farmer" };
        mockedSensorModel.findOne.mockResolvedValue({
            sensorId: "sensor1",
            firmId: "firm1",
        } as never);
        mockedFirmModel.findById.mockResolvedValue({
            _id: "firm1",
            owner: "user1",
        } as never);

        const result = await verifySensorOwnership("sensor1", userContext);
        expect(result).toBe(true);
    });

    it("returns false when user does not own the firm", async () => {
        const userContext: UserContext = { userId: "user1", role: "farmer" };
        mockedSensorModel.findOne.mockResolvedValue({
            sensorId: "sensor1",
            firmId: "firm1",
        } as never);
        mockedFirmModel.findById.mockResolvedValue({
            _id: "firm1",
            owner: "other_user",
        } as never);

        const result = await verifySensorOwnership("sensor1", userContext);
        expect(result).toBe(false);
    });

    it("returns false for non-existent sensor", async () => {
        const userContext: UserContext = { userId: "user1", role: "farmer" };
        mockedSensorModel.findOne.mockResolvedValue(null);

        const result = await verifySensorOwnership("nonexistent", userContext);
        expect(result).toBe(false);
    });

    it("returns false when firm is deleted (orphaned sensor)", async () => {
        const userContext: UserContext = { userId: "user1", role: "farmer" };
        mockedSensorModel.findOne.mockResolvedValue({
            sensorId: "sensor1",
            firmId: "firm1",
        } as never);
        mockedFirmModel.findById.mockResolvedValue(null);

        const result = await verifySensorOwnership("sensor1", userContext);
        expect(result).toBe(false);
    });
});

describe("getSensorByIdService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns sensor for admin regardless of ownership", async () => {
        const userContext: UserContext = { userId: "admin1", role: "admin" };
        mockedSensorModel.findOne.mockResolvedValue({
            sensorId: "sensor1",
            firmId: "firm1",
        } as never);

        const result = await getSensorByIdService("sensor1", userContext);
        expect(result).not.toBeNull();
        expect(mockedFirmModel.findById).not.toHaveBeenCalled();
    });

    it("returns sensor when user owns the firm", async () => {
        const userContext: UserContext = { userId: "user1", role: "farmer" };
        mockedSensorModel.findOne.mockResolvedValue({
            sensorId: "sensor1",
            firmId: "firm1",
        } as never);
        mockedFirmModel.findById.mockResolvedValue({
            _id: "firm1",
            owner: "user1",
        } as never);

        const result = await getSensorByIdService("sensor1", userContext);
        expect(result).not.toBeNull();
    });

    it("returns null when user does not own the firm", async () => {
        const userContext: UserContext = { userId: "user1", role: "farmer" };
        mockedSensorModel.findOne.mockResolvedValue({
            sensorId: "sensor1",
            firmId: "firm1",
        } as never);
        mockedFirmModel.findById.mockResolvedValue({
            _id: "firm1",
            owner: "other_user",
        } as never);

        const result = await getSensorByIdService("sensor1", userContext);
        expect(result).toBeNull();
    });

    it("returns null for non-existent sensor", async () => {
        const userContext: UserContext = { userId: "user1", role: "farmer" };
        mockedSensorModel.findOne.mockResolvedValue(null);

        const result = await getSensorByIdService("nonexistent", userContext);
        expect(result).toBeNull();
    });

    it("returns sensor without userContext (backward compat)", async () => {
        mockedSensorModel.findOne.mockResolvedValue({
            sensorId: "sensor1",
            firmId: "firm1",
        } as never);

        const result = await getSensorByIdService("sensor1");
        expect(result).not.toBeNull();
    });
});

describe("deleteSensorByIdService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deletes sensor for admin", async () => {
        const userContext: UserContext = { userId: "admin1", role: "admin" };
        mockedSensorModel.findOneAndDelete.mockResolvedValue({
            sensorId: "sensor1",
        } as never);

        const result = await deleteSensorByIdService("sensor1", userContext);
        expect(result).not.toBeNull();
    });

    it("deletes sensor when user owns the firm", async () => {
        const userContext: UserContext = { userId: "user1", role: "farmer" };
        mockedSensorModel.findOne.mockResolvedValue({
            sensorId: "sensor1",
            firmId: "firm1",
        } as never);
        mockedFirmModel.findById.mockResolvedValue({
            _id: "firm1",
            owner: "user1",
        } as never);
        mockedSensorModel.findOneAndDelete.mockResolvedValue({
            sensorId: "sensor1",
        } as never);

        const result = await deleteSensorByIdService("sensor1", userContext);
        expect(result).not.toBeNull();
    });

    it("returns null when user does not own the firm", async () => {
        const userContext: UserContext = { userId: "user1", role: "farmer" };
        mockedSensorModel.findOne.mockResolvedValue({
            sensorId: "sensor1",
            firmId: "firm1",
        } as never);
        mockedFirmModel.findById.mockResolvedValue({
            _id: "firm1",
            owner: "other_user",
        } as never);

        const result = await deleteSensorByIdService("sensor1", userContext);
        expect(result).toBeNull();
        expect(mockedSensorModel.findOneAndDelete).not.toHaveBeenCalled();
    });

    it("deletes without userContext (backward compat)", async () => {
        mockedSensorModel.findOneAndDelete.mockResolvedValue({
            sensorId: "sensor1",
        } as never);

        const result = await deleteSensorByIdService("sensor1");
        expect(result).not.toBeNull();
    });
});
