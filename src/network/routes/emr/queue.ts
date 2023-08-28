import { Router, Request, Response, NextFunction } from "express";
import RBAC from "../../../services/rbac";
const Queue = Router();

Queue.route('/queue/call_number')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const dataToPost = req.body;
    try {
      if (dataToPost) {
        const result = await global.messagingService.sendMessage(
          dataToPost.company_code,
          '/queue/call_number',
          { ...dataToPost, token: req.token },
        );
        const response = result.body;

        if (response) {
          if (!res.writableEnded) {
            res.status(200).json({
              ...response,
            })
          }
        }
        if (!response) {
          if (!res.writableEnded) {
            res.status(500).json({
              message: 'error',
            })
          }
        }
      }
      if (!dataToPost) {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'No Request',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        })
      }
    }
  });

Queue.route('/queue/finish')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const dataToPost = req.body;
    try {
      if (dataToPost) {
        const result = await global.messagingService.sendMessage(
          dataToPost.company_code,
          '/queue/finish',
          { ...dataToPost, token: req.token },
        );
        const response = result.body;

        if (response) {
          if (!res.writableEnded) {
            res.status(200).json({
              ...response,
            })
          }
        }
        if (!response) {
          if (!res.writableEnded) {
            res.status(500).json({
              message: 'error',
            })
          }
        }
      }
      if (!dataToPost) {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'No Request',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        })
      }
    }
  });

Queue.route('/queue/move_next')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const dataToPost = req.body;
    try {
      if (dataToPost) {
        const result = await global.messagingService.sendMessage(
          dataToPost.company_code,
          '/queue/move_next',
          { ...dataToPost, token: req.token },
        );
        const response = result.body;

        if (response) {
          if (!res.writableEnded) {
            res.status(200).json({
              ...response,
            })
          }
        }
        if (!response) {
          if (!res.writableEnded) {
            res.status(500).json({
              message: 'error',
            })
          }
        }
      }
      if (!dataToPost) {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'No Request',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        })
      }
    }
  });

Queue.route('/queue/add_play_list')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const dataToPost = req.body;
    try {
      if (dataToPost) {
        const result = await global.messagingService.sendMessage(
          dataToPost.company_code,
          '/queue/add_play_list',
          { ...dataToPost, token: req.token },
        );
        const response = result.body;

        if (response) {
          if (!res.writableEnded) {
            res.status(200).json({
              ...response,
            })
          }
        }
        if (!response) {
          if (!res.writableEnded) {
            res.status(500).json({
              message: 'error',
            })
          }
        }
      }
      if (!dataToPost) {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'No Request',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        })
      }
    }
  })

Queue.route('/queue/wait_list_all')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const dataToPost = req.body;
    try {
      if (dataToPost) {
        const result = await global.messagingService.sendMessage(
          dataToPost.company_code,
          '/queue/wait_list_all',
          { ...dataToPost, token: req.token },
        );
        const response = result.body;
        if (!res.writableEnded) {
          res.status(200).json({
            ...response,
          })
        }
      }
      if (!dataToPost) {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'No Request',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        })
      }
    }
  });

Queue.route('/queue/wait_list_all_total')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const dataToPost = req.body;
    try {
      if (dataToPost) {
        const result = await global.messagingService.sendMessage(
          dataToPost.company_code,
          '/queue/wait_list_all_total',
          { ...dataToPost, token: req.token },
        );
        const response = result.body;
        if (!res.writableEnded) {
          res.status(200).json({
            ...response,
          })
        }
      }
      if (!dataToPost) {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'No Request',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        })
      }
    }
  });

Queue.route('/queue/places')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const dataToPost = req.body;
    try {
      if (dataToPost) {
        const result = await global.medicalRecord.get(`Queue:{${dataToPost.company_code}}`);
        if (result && result !== null) {
          const places: Array<IPlace> = result.places;
          const filtered = places && places.filter((value: IPlace) => value.QueueStationId === dataToPost.station_id);
          if (!res.writableEnded) {
            res.status(200).json({
              message: 'OK',
              data: filtered ? filtered : [],
            })
          }
        }
        if (!result || (result && result === null)) {
          if (!res.writableEnded) {
            res.status(500).json({
              message: 'Data tidak ada',
            })
          }
        }
      }
      if (!dataToPost) {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'No Request',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        })
      }
    }
  });

Queue.route('/queue/places_available')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const dataToPost = req.body;
    try {
      if (dataToPost) {
        const result = await global.medicalRecord.get(`Queue:{${dataToPost.company_code}}`);
        if (result && result !== null) {
          const placesAvail: Array<IPlacesAvail> = result.places_avail;
          const filtered = placesAvail && placesAvail.filter((value: IPlacesAvail) => value.QueueStationId === dataToPost.station_id);
          if (!res.writableEnded) {
            res.status(200).json({
              message: 'OK',
              data: filtered ? filtered : [],
            })
          }
        }
        if (!result || (result && result === null)) {
          if (!res.writableEnded) {
            res.status(500).json({
              message: 'Data tidak ada',
            })
          }
        }
      }
      if (!dataToPost) {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'No Request',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        })
      }
    }
  });

Queue.route('/queue/stations_new')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const dataToPost = req.body;
    try {
      if (dataToPost) {
        const result = await global.medicalRecord.get(`Queue:{${dataToPost.company_code}}`);
        if (result && result !== null) {
          const stations: Array<IStation> = result.stations;
          if (!res.writableEnded) {
            res.status(200).json({
              message: 'OK',
              data: stations,
            })
          }
        }
        if (!result || (result && result === null)) {
          if (!res.writableEnded) {
            res.status(500).json({
              message: 'Data tidak ada',
            })
          }
        }
      }
      if (!dataToPost) {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'No Request',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        })
      }
    }
  });

Queue.route('/queue/wait_list_place')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const dataToPost = req.body;
    try {
      if (dataToPost) {
        const result = await global.messagingService.sendMessage(
          dataToPost.company_code,
          '/queue/wait_list_place',
          { ...dataToPost, token: req.token },
        );
        const response = result.body;

        if (response) {
          if (!res.writableEnded) {
            res.status(200).json({
              ...response,
            })
          }
        }
        if (!response) {
          if (!res.writableEnded) {
            res.status(500).json({
              message: 'error',
            })
          }
        }
      }
      if (!dataToPost) {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'No Request',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        })
      }
    }
  });

Queue.route('/queue/wait_list_place_total')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const dataToPost = req.body;
    try {
      if (dataToPost) {
        const result = await global.messagingService.sendMessage(
          dataToPost.company_code,
          '/queue/wait_list_place_total',
          { ...dataToPost, token: req.token },
        );
        const response = result.body;

        if (response) {
          if (!res.writableEnded) {
            res.status(200).json({
              ...response,
            })
          }
        }
        if (!response) {
          if (!res.writableEnded) {
            res.status(500).json({
              message: 'error',
            })
          }
        }
      }
      if (!dataToPost) {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'No Request',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        })
      }
    }
  });

Queue.route('/queue/display')
  .post(RBAC.getInstance().isUserAuthenticated, async(
    req: Request,
    res: Response,
  ): Promise<void> => {
    const dataToPost = req.body;
    try {
      if (dataToPost) {
        const result = await global.messagingService.sendMessage(
          dataToPost.company_code,
          '/queue/display',
          { ...dataToPost, token: req.token },
        );
        const response = result.body;

        if (response) {
          if (!res.writableEnded) {
            res.status(200).json({
              ...response,
            })
          }
        }
        if (!response) {
          if (!res.writableEnded) {
            res.status(500).json({
              message: 'error',
            })
          }
        }
      }
      if (!dataToPost) {
        if (!res.writableEnded) {
          res.status(500).json({
            message: 'No Request',
          })
        }
      }
    } catch (err) {
      if (!res.writableEnded) {
        res.status(500).json({
          message: err,
        })
      }
    }
  });


export { Queue }
