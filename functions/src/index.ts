/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions";
import { squareClient } from "./square-client";

export const getInstructors = functions.https.onCall(async (data, context) => {
  try {
    const { result } = await squareClient.teamApi.searchTeamMembers({});
    return result.teamMembers;
  } catch (error) {
    console.error("Error fetching instructors:", error);
    throw new functions.https.HttpsError("internal", "Could not fetch instructors.");
  }
});

export const searchAvailability = functions.https.onCall(async (data, context) => {
  const { serviceId, teamMemberId, startAt, endAt } = data;
  const locationId = functions.config().square.location_id;

  try {
    const { result } = await squareClient.bookingsApi.searchAvailability({
      query: {
        filter: {
          locationId: locationId,
          startAtRange: {
            startAt,
            endAt,
          },
          segmentFilters: [
            {
              serviceVariationId: serviceId,
              teamMemberIdFilter: {
                any: [teamMemberId],
              },
            },
          ],
        },
      },
    });
    return result.availabilities;
  } catch (error) {
    console.error("Error searching availability:", error);
    throw new functions.https.HttpsError("internal", "Could not search availability.");
  }
});

export const createBooking = functions.https.onCall(async (data, context) => {
  const { startAt, serviceId, teamMemberId, customerId, customerNote } = data;
  const locationId = functions.config().square.location_id;

  try {
    const { result } = await squareClient.bookingsApi.createBooking({
      booking: {
        locationId: locationId,
        startAt,
        appointmentSegments: [
          {
            durationMinutes: 60, // Or get this from the service
            serviceVariationId: serviceId,
            teamMemberId,
          },
        ],
        customerId,
        customerNote,
      },
    });
    return result.booking;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw new functions.https.HttpsError("internal", "Could not create booking.");
  }
});

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
