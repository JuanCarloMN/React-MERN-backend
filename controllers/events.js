
const { response } = require('express');
const Event = require('../models/Event');

const getEvents = async ( req, res = response ) => {

    try {
        const events = await Event.find({}).populate('user', 'name');

        if ( events.length === 0 ) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontraron eventos'
            })
        }

        return res.json({
            ok: true,
            eventos: events
        });

    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const createEvent = async ( req, res = response ) => {

    const event = new Event( req.body );
    try {
        
        event.user = req.uid;
        const eventSaved = await event.save();

        return res.status(201).json({
                ok: true,
                evento: eventSaved
            })

        } catch (error) {
            console.log( error );
            res.status(500).json({
                ok: false,
                msg: 'Por favor hable con el administrador'
            });
    }
}

const updateEvent = async ( req, res = response ) => {
    
    const eventId = req.params.id;
    const uid = req.uid;
    
    try {
        const event = await Event.findById( eventId );
        
        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento'
            });
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const eventUpdated = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } )

        return res.status(200).json({
            ok: true,
            evento: eventUpdated
        })

    } catch (error) {
        console.log( error );
            res.status(500).json({
                ok: false,
                msg: 'Por favor hable con el administrador'
            });
    }
}


const deleteEvent = async ( req, res = response ) => {
    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const event = await Event.findById( eventId );
        
        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            });
        }
        const eventDeleted = await Event.findOneAndDelete( eventId );

        return res.status(200).json({
            ok: true,
            msg: 'Se eliminó el evento',
            evento: eventDeleted
        });

    } catch (error) {
        console.log( error );
            res.status(500).json({
                ok: false,
                msg: 'Por favor hable con el administrador'
            });
    }
}

module.exports = {
    getEvents, 
    createEvent, 
    updateEvent, 
    deleteEvent
}